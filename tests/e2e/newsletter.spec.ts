import { test, expect } from '@playwright/test';

test('owner can show and hide the homepage newsletter', async ({
  page,
  browser,
}) => {
  const email = process.env.E2E_OWNER_EMAIL;
  const password = process.env.E2E_OWNER_PASSWORD;
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  if (!email || !password)
    throw new Error('Set owner credentials for newsletter verification.');
  const visitor = await browser.newPage();
  try {
    await visitor.goto(`${baseURL}/admin`);
    await expect(visitor).toHaveURL(/\/admin\/login$/);
    await page.goto('/admin/login');
    await page.getByText('Use owner password', { exact: true }).click();
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/admin$/);
    const settings = page.getByRole('region', { name: 'Homepage newsletter' });
    await expect(settings.getByText('Hidden', { exact: true })).toBeVisible();
    await visitor.goto(baseURL);
    await expect(
      visitor.locator('#newsletter, a[href="#newsletter"]'),
    ).toHaveCount(0);
    try {
      await settings
        .getByRole('button', { name: 'Show newsletter', exact: true })
        .click();
      await expect(
        settings.getByText('Visible', { exact: true }),
      ).toBeVisible();
      await page.reload();
      await expect(
        settings.getByRole('button', { name: 'Hide newsletter', exact: true }),
      ).toBeVisible();
      await visitor.goto(baseURL);
      await expect(visitor.locator('#newsletter')).toBeVisible();
      await expect(
        visitor.getByRole('link', { name: 'Newsletter', exact: true }).first(),
      ).toBeVisible();
      await visitor.setViewportSize({ width: 390, height: 844 });
      await visitor
        .getByRole('button', { name: 'Open menu', exact: true })
        .click();
      await expect(
        visitor.getByRole('link', { name: 'Newsletter', exact: true }).last(),
      ).toBeVisible();
    } finally {
      const hide = settings.getByRole('button', {
        name: 'Hide newsletter',
        exact: true,
      });
      if (await hide.count()) {
        await hide.click();
        await expect(
          settings.getByText('Hidden', { exact: true }),
        ).toBeVisible();
      }
    }
    await page.reload();
    await expect(settings.getByText('Hidden', { exact: true })).toBeVisible();
    await visitor.goto(baseURL);
    await expect(
      visitor.locator('#newsletter, a[href="#newsletter"]'),
    ).toHaveCount(0);
    await visitor
      .getByRole('button', { name: 'Open menu', exact: true })
      .click();
    await expect(visitor.locator('a[href="#newsletter"]')).toHaveCount(0);
  } finally {
    await visitor.close();
  }
});
