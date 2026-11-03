import { test, expect } from '@playwright/test';

test('ShopFlow homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/ShopFlow/i);

  await expect(
    page.getByRole('link', { name: 'Products' })
  ).toBeVisible();
});