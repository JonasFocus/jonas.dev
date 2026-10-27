import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { chromium, expect } from '@playwright/test';

const require = createRequire(import.meta.url);
const user = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'owner@example.test',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {},
  created_at: new Date().toISOString(),
};
const token =
  [
    { alg: 'HS256', typ: 'JWT' },
    {
      sub: user.id,
      email: user.email,
      role: 'authenticated',
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
  ]
    .map((part) => Buffer.from(JSON.stringify(part)).toString('base64url'))
    .join('.') + '.test';
let logouts = 0;
let unavailable = true;
let authStatus = 200;
const gateway = createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', appOrigin);
  response.setHeader(
    'Access-Control-Allow-Headers',
    'authorization,apikey,x-client-info,content-type,x-supabase-api-version',
  );
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Content-Type', 'application/json');
  if (request.method === 'OPTIONS') return response.end();
  if (request.url.startsWith('/auth/v1/token'))
    return response.end(
      JSON.stringify({
        access_token: token,
        refresh_token: 'test-refresh-token',
        token_type: 'bearer',
        expires_in: 3600,
        user,
      }),
    );
  if (request.url.startsWith('/auth/v1/user')) {
    response.statusCode = authStatus;
    return response.end(
      JSON.stringify(
        authStatus === 200 ? user : { message: 'Test auth failure' },
      ),
    );
  }
  if (request.url.startsWith('/auth/v1/logout')) {
    logouts++;
    return response.end('{}');
  }
  if (request.url.startsWith('/rest/v1/admin_users')) {
    response.statusCode = unavailable ? 503 : 200;
    return response.end(
      JSON.stringify(
        unavailable
          ? { message: 'Test database unavailable', code: '08006' }
          : [],
      ),
    );
  }
  response.statusCode = 404;
  response.end('{}');
});
function port(server) {
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Expected a local TCP listener');
  return address.port;
}
await new Promise((resolve) => gateway.listen(0, resolve));
const reservation = createServer();
await new Promise((resolve) => reservation.listen(0, resolve));
const appPort = port(reservation);
const appOrigin = `http://localhost:${appPort}`;
await new Promise((resolve) => reservation.close(resolve));
const server = spawn(
  process.execPath,
  [
    require.resolve('next/dist/bin/next'),
    'dev',
    '--webpack',
    '--port',
    String(appPort),
  ],
  {
    cwd: new URL('..', import.meta.url),
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: `http://localhost:${port(gateway)}`,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
      APP_URL: appOrigin,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
let output = '';
server.stdout.on('data', (data) => {
  output += data;
});
server.stderr.on('data', (data) => {
  output += data;
});
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null)
      throw new Error(`Test server exited: ${output}`);
    try {
      const response = await fetch(`${appOrigin}/admin/login`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for the local Next.js process to start. */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(ready, true, `Test server did not become ready: ${output}`);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${appOrigin}/admin/login`);
  await page.locator('summary').click();
  async function signIn() {
    await page.getByLabel('Email', { exact: true }).fill(user.email);
    await page
      .getByLabel('Password', { exact: true })
      .fill('test-password-only');
    const response = page.waitForResponse((result) =>
      result.url().endsWith('/api/admin/session'),
    );
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    return response;
  }
  const failed = await signIn();
  assert.equal(failed.status(), 503);
  await expect(page.locator('.cx-error')).toHaveText(
    'Admin access is temporarily unavailable. Please try again.',
  );
  await expect(
    page.getByRole('button', { name: 'Sign in', exact: true }),
  ).toBeEnabled();
  assert.equal(logouts, 0);
  const authCookies = () =>
    page
      .context()
      .cookies()
      .then((cookies) =>
        cookies.filter((cookie) => cookie.name.includes('auth-token')),
      );
  assert.ok(
    (await authCookies()).length > 0,
    'A temporary outage must preserve the login session',
  );
  for (const status of [503, 429]) {
    authStatus = status;
    const authFailure = await signIn();
    assert.equal(authFailure.status(), 503);
    await expect(page.locator('.cx-error')).toHaveText(
      'Admin access is temporarily unavailable. Please try again.',
    );
    await expect(
      page.getByRole('button', { name: 'Sign in', exact: true }),
    ).toBeEnabled();
    assert.equal(logouts, 0);
    assert.ok(
      (await authCookies()).length > 0,
      `Auth ${status} must preserve the login session`,
    );
  }
  authStatus = 401;
  const expired = await signIn();
  assert.equal(expired.status(), 401);
  await expect(page.locator('.cx-error')).toHaveText(
    'This account cannot access the workspace.',
  );
  await expect(
    page.getByRole('button', { name: 'Sign in', exact: true }),
  ).toBeEnabled();
  assert.ok(logouts > 0, 'Invalid sessions must still be signed out');
  assert.equal((await authCookies()).length, 0);
  logouts = 0;
  authStatus = 200;
  unavailable = false;
  const denied = await signIn();
  assert.equal(denied.status(), 403);
  await expect(page.locator('.cx-error')).toHaveText(
    'This account cannot access the workspace.',
  );
  await expect(
    page.getByRole('button', { name: 'Sign in', exact: true }),
  ).toBeEnabled();
  assert.ok(logouts > 0, 'A confirmed non-owner must still be signed out');
  assert.equal((await authCookies()).length, 0);
  console.log(
    'PASS: membership and auth outages retain sessions; invalid sessions and confirmed non-owners sign out.',
  );
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  await new Promise((resolve) => gateway.close(resolve));
}
