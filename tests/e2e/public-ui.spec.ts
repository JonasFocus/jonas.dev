import { test, expect } from '@playwright/test';

test('mobile project request stays open and restores scrolling after Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page
    .locator('.mobile-dropdown')
    .getByRole('button', { name: 'Start your project', exact: false })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Close menu', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close menu', exact: true }).click();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('theme remains usable when browser storage is blocked', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  const switchTheme = page.getByRole('button', {
    name: 'Switch to light mode',
    exact: true,
  });
  await expect(switchTheme).toBeVisible();
  await switchTheme.click();
  await expect(page.locator('#top')).toHaveAttribute('data-theme', 'light');
  await page
    .getByRole('button', { name: 'Switch to dark mode', exact: true })
    .click();
  await expect(page.locator('#top')).toHaveAttribute('data-theme', 'dark');
});

test('theme follows a saved choice from another tab', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('#top')).toHaveAttribute('data-theme', 'dark');
  const otherTab = await context.newPage();
  await otherTab.goto('/');
  await otherTab.evaluate(() => localStorage.setItem('theme', 'light'));
  await expect(page.locator('#top')).toHaveAttribute('data-theme', 'light');
  await otherTab.close();
});

test('resizing an open mobile menu to desktop restores page scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('mobile request survives desktop resize without leaving the page locked', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page
    .locator('.mobile-dropdown')
    .getByRole('button', { name: 'Start your project', exact: false })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Your name *', exact: true })
    .fill('Resize check');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Your name *', exact: true }),
  ).toHaveValue('Resize check');
  await page
    .getByRole('button', { name: 'Close request', exact: true })
    .click();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});
