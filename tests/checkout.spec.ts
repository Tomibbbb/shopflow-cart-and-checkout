
import { test, expect } from '@playwright/test';

test('User can complete checkout successfully', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');

  // Find Aurora Wireless Headphones
  const product = page.getByTestId('product-card').filter({
    hasText: 'Aurora Wireless Headphones'
  });

  // Add product to cart
  await product.getByTestId('add-to-cart').click();

  // Verify cart count
  await expect(
    page.getByTestId('cart-count')
  ).toHaveText('1');

  // Navigate to cart
  await page.goto('/cart');

  // Verify subtotal
  await expect(
    page.getByTestId('summary-subtotal')
  ).toHaveText('$149.99');

  // Navigate to checkout
  await page.goto('/checkout');

  // Fill shipping details
  await page.getByTestId('checkout-name').fill('Test Customer');
  await page.getByTestId('checkout-email').fill('qa@example.com');
  await page.getByTestId('checkout-address').fill('123 Test Street');

  await page.getByLabel('City').fill('London');
  await page.getByLabel('Postal code').fill('SW1A 1AA');

  // Fill simulated payment details
  await page.getByLabel('Card number').fill('4242424242424242');
  await page.getByLabel('Expiry').fill('12/28');
  await page.getByLabel('CVC').fill('123');

  // Submit checkout
  await page.getByTestId('checkout-submit').click();

  // Verify successful navigation
  await expect(page).toHaveURL(/\/order-confirmation/);

  // Verify order confirmation is displayed
  await expect(
    page.getByTestId('order-confirmation')
  ).toBeVisible();
});
