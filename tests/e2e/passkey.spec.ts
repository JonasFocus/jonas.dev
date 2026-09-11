import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
test('owner can register and sign in with a passkey', async ({
  page,
  context,
}) => {
  const email = process.env.E2E_OWNER_EMAIL,
    password = process.env.E2E_OWNER_PASSWORD,
    url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!email || !password || !url || !key)
    throw new Error('Owner test configuration required');
  const owner = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      experimental: { passkey: true },
    },
  });
  expect(
    (await owner.auth.signInWithPassword({ email, password })).error,
  ).toBeNull();
  const before = await owner.auth.passkey.list();
  expect(before.error).toBeNull();
  const existing = new Set((before.data ?? []).map((item) => item.id));
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send(
    'WebAuthn.addVirtualAuthenticator',
    {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    },
  );
  try {
    await page.goto('/admin/login');
    await page.locator('summary').click();
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/security');
    await page.getByRole('button', { name: 'Add a passkey' }).click();
    await expect(
      page.getByText('Passkey added. You can use this device to sign in.'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page
      .getByRole('button', { name: 'Sign in with a passkey', exact: true })
      .click();
    await expect(page).toHaveURL(/\/admin$/);
  } finally {
    await owner.auth.signInWithPassword({ email, password });
    const after = await owner.auth.passkey.list();
    expect(after.error).toBeNull();
    for (const item of after.data ?? [])
      if (!existing.has(item.id))
        expect(
          (await owner.auth.passkey.delete({ passkeyId: item.id })).error,
        ).toBeNull();
    await cdp.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
    await owner.auth.signOut({ scope: 'local' });
  }
});
