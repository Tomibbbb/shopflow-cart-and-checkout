
import { test, expect } from '@playwright/test';

test('User can search for a product', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');

  // Verify the full catalogue is loaded
  await expect(
    page.getByText('12 products')
  ).toBeVisible();

  // Locate the search field
  const searchInput = page.getByTestId('product-search');

  // Verify the search field is ready
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toBeEnabled();

  // Search for Aurora
  await searchInput.fill('Aurora');

  // Verify the search field contains the correct value
  await expect(searchInput).toHaveValue('Aurora');

  // Verify the search query is reflected in the URL
  await expect(page).toHaveURL(
    /\/products\?q=Aurora/,
    { timeout: 10000 }
  );

  // Verify only one product remains
  await expect(
    page.getByTestId('product-card')
  ).toHaveCount(1, { timeout: 10000 });

  // Verify the correct product is displayed
  await expect(
    page.getByText('Aurora Wireless Headphones')
  ).toBeVisible();
});

test('User can filter products by category', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');

  // Verify the full catalogue is displayed
  await expect(
    page.getByTestId('product-card')
  ).toHaveCount(12);

  // Select Electronics category
  await page.getByRole('button', {
    name: 'Electronics',
    exact: true
  }).click();

  // Verify only three products remain
  await expect(
    page.getByTestId('product-card')
  ).toHaveCount(3);

  // Verify Electronics products are displayed
  await expect(
    page.getByText('Aurora Wireless Headphones')
  ).toBeVisible();

  await expect(
    page.getByText('Pulse Smartwatch')
  ).toBeVisible();

  await expect(
    page.getByText('Echo Mini Speaker')
  ).toBeVisible();

  // Verify an unrelated product is not displayed
  await expect(
    page.getByText('Classic Denim Jacket')
  ).toBeHidden();
});
