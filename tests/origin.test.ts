import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { isAllowedOrigin } from '../lib/crm/origin';

const keys = [
  'APP_URL',
  'DEPLOYMENT_ORIGIN',
  'VERCEL',
  'VERCEL_URL',
  'VERCEL_BRANCH_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
] as const;
let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
});
afterEach(() => {
  for (const key of keys) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

const from = (origin?: string) =>
  new Request('https://example.test/api/requests', {
    method: 'POST',
    headers: origin ? { origin } : {},
  });

test('Vercel deployments accept their deployment, branch and production origins', () => {
  process.env.APP_URL = 'https://jonasinfocus.com';
  process.env.VERCEL = '1';
  process.env.VERCEL_URL = 'site-abc123.vercel.app';
  process.env.VERCEL_BRANCH_URL = 'site-git-feature.vercel.app';
  process.env.VERCEL_PROJECT_PRODUCTION_URL = 'site.vercel.app';
  for (const origin of [
    'https://jonasinfocus.com',
    'https://site-abc123.vercel.app',
    'https://site-git-feature.vercel.app',
    'https://site.vercel.app',
  ])
    assert.equal(isAllowedOrigin(from(origin)), true, origin);
  assert.equal(isAllowedOrigin(from('https://evil.example')), false);
  assert.equal(isAllowedOrigin(from('http://site.vercel.app')), false);
});

test('requests without an origin or from an unlisted origin are rejected', () => {
  process.env.APP_URL = 'https://jonasinfocus.com';
  assert.equal(isAllowedOrigin(from()), false);
  assert.equal(isAllowedOrigin(from('https://site-abc123.vercel.app')), false);
});
