import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
const email = process.env.E2E_OWNER_EMAIL;
const password = process.env.E2E_OWNER_PASSWORD;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

test('public request to owner review to customer', async ({
  page,
  request,
  baseURL,
}) => {
  if (!email || !password || !url || !key || !baseURL)
    throw new Error(
      'Set E2E_OWNER_EMAIL, E2E_OWNER_PASSWORD and Supabase public configuration. This test requires real configured storage and owner auth.',
    );
  const owner = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const login = await owner.auth.signInWithPassword({ email, password });
  expect(login.error).toBeNull();
  let id: string = randomUUID();
  const payload = {
    submissionId: id,
    name: `Verification ${id.slice(0, 8)}`,
    email: `verify-${id.slice(0, 8)}@example.test`,
    company: 'Fictional verification',
    service: 'website',
    description: 'A fictional project to verify the complete request workflow.',
    consent: true,
  };
  let customerId: string | undefined;
  try {
    const denied = await request.post('/api/requests', {
      data: payload,
      headers: { Origin: 'https://untrusted.example' },
    });
    expect(denied.status()).toBe(403);
    const invalid = await request.post('/api/requests', {
      data: { ...payload, email: 'invalid' },
      headers: { Origin: baseURL },
    });
    expect(invalid.status()).toBe(400);
    await page.goto('/');
    await page
      .getByRole('button', { name: 'Start your project', exact: false })
      .click();
    await page
      .getByRole('textbox', { name: 'Name *', exact: true })
      .fill(payload.name);
    await page
      .getByRole('textbox', { name: 'Email *', exact: true })
      .fill(payload.email);
    await page
      .getByRole('textbox', { name: 'Company', exact: true })
      .fill(payload.company);
    await page
      .getByRole('combobox', { name: 'Project type *' })
      .selectOption('website');
    await page
      .getByRole('textbox', { name: 'What would you like to build? *' })
      .fill(payload.description);
    await page.getByRole('checkbox').check();
    const saving = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/requests') &&
        response.request().method() === 'POST',
    );
    await page
      .getByRole('button', { name: 'Send request', exact: true })
      .click();
    const saved = await saving;
    expect(saved.status()).toBe(201);
    const body: unknown = await saved.json();
    if (
      !body ||
      typeof body !== 'object' ||
      !('reference' in body) ||
      typeof body.reference !== 'string'
    )
      throw new Error('Missing saved request reference');
    id = body.reference;
    await expect(
      page.getByRole('heading', { name: 'Request received.' }),
    ).toBeVisible();
    await expect(
      page.getByText(`Reference: ${id}`, { exact: true }),
    ).toBeVisible();
    const submitted: unknown = saved.request().postDataJSON();
    const retry = await request.post('/api/requests', {
      data: submitted,
      headers: { Origin: baseURL },
    });
    expect(retry.status()).toBe(201);
    expect(await retry.json()).toMatchObject({ ok: true, reference: id });
    await page.getByRole('button', { name: 'Close request' }).click();
    const anon = createClient(url, key, { auth: { persistSession: false } });
    const anonResult = await anon.from('requests').select('id').eq('id', id);
    expect(anonResult.data ?? []).toHaveLength(0);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.locator('summary').click();
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto(`/admin/requests/${id}`);
    await expect(
      page.getByRole('heading', { name: payload.name }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Mark as read', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'Mark as read', exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole('combobox', { name: 'Status', exact: true })
      .selectOption('qualified');
    await page.getByRole('button', { name: 'Update status' }).click();
    await expect(
      page.getByText('Status changed to qualified', { exact: true }),
    ).toBeVisible();
    await page
      .getByLabel('Note', { exact: true })
      .fill('Verified customer workflow.');
    await page.getByRole('button', { name: 'Add note', exact: true }).click();
    await expect(
      page.getByText('Verified customer workflow.', { exact: true }),
    ).toBeVisible();
    await page
      .getByLabel('Next step', { exact: true })
      .fill('Review test scope');
    await page
      .getByLabel('Due date and time', { exact: false })
      .fill('2026-12-01T12:00');
    await page
      .getByRole('button', { name: 'Add follow-up', exact: true })
      .click();
    await expect(
      page.getByText('Review test scope', { exact: true }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Mark complete', exact: true })
      .click();
    await expect(
      page.getByText('Follow-up completed', { exact: true }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Convert to customer', exact: true })
      .click();
    await page
      .getByRole('link', { name: 'View customer', exact: false })
      .click();
    await expect(page).toHaveURL(/\/admin\/customers\//);
    customerId = page.url().split('/').at(-1);
    await page
      .getByLabel('Company', { exact: true })
      .fill('Updated verification company');
    await page
      .getByRole('button', { name: 'Save customer', exact: true })
      .click();
    await expect(page.getByText('Saved.', { exact: true })).toBeVisible();
    const state = await owner
      .from('requests')
      .select('id,status,read_at,customer_id')
      .eq('id', id)
      .single();
    expect(state.data?.status).toBe('qualified');
    expect(state.data?.read_at).toBeTruthy();
    expect(state.data?.customer_id).toBe(customerId);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto(`/admin/requests/${id}`);
    await expect(page).toHaveURL(/\/admin\/login/);
  } finally {
    const cleanupLogin = await owner.auth.signInWithPassword({
      email,
      password,
    });
    expect(cleanupLogin.error).toBeNull();
    const stored = await owner
      .from('requests')
      .select('customer_id')
      .eq('id', id)
      .maybeSingle();
    customerId ??= stored.data?.customer_id ?? undefined;
    const removed = await owner.from('requests').delete().eq('id', id);
    expect(removed.error).toBeNull();
    if (customerId)
      expect(
        (await owner.from('customers').delete().eq('id', customerId)).error,
      ).toBeNull();
    await owner.auth.signOut({ scope: 'local' });
  }
});
