
import { test, expect } from '@playwright/test';

test('User can add a product to the cart', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');

  // Verify the cart starts empty
  await expect(
    page.getByTestId('cart-count')
  ).toHaveText('0');

  // Find the Aurora Wireless Headphones product
  const product = page.getByTestId('product-card').filter({
    hasText: 'Aurora Wireless Headphones'
  });

  // Verify the correct product is displayed
  await expect(product).toBeVisible();

  // Add the product to the cart
  await product.getByTestId('add-to-cart').click();

  // Verify cart count increases
  await expect(
    page.getByTestId('cart-count')
  ).toHaveText('1');

  // Navigate to cart
  await page.goto('/cart');

  // Verify the product appears in the cart
  await expect(
    page.getByText('Aurora Wireless Headphones')
  ).toBeVisible();

  // Verify the correct price is displayed
await expect(
  page.getByTestId('item-total')
).toHaveText('$149.99');

await expect(
  page.getByTestId('summary-subtotal')
).toHaveText('$149.99');
});


test('User can update product quantity in the cart', async ({ page }) => {
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

  // Verify initial subtotal
  await expect(
    page.getByTestId('summary-subtotal')
  ).toHaveText('$149.99');

  // Locate quantity input

  // Locate the quantity display
  const quantity = page.getByTestId('cart-quantity');

  // Verify initial quantity
  await expect(quantity).toHaveText('1');

  // Click the increase quantity button
  await page.getByRole('button', {
    name: 'Increase quantity'
  }).click();

  // Verify quantity increased to 2
  await expect(quantity).toHaveText('2');

  // Verify updated item total
  await expect(
    page.getByTestId('item-total')
  ).toHaveText('$299.98');

  // Verify updated subtotal
  await expect(
    page.getByTestId('summary-subtotal')
  ).toHaveText('$299.98');
});


test('User can remove a product from the cart', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');

  // Find Aurora Wireless Headphones
  const product = page.getByTestId('product-card').filter({
    hasText: 'Aurora Wireless Headphones'
  });

  // Add product to cart
  await product.getByTestId('add-to-cart').click();

  // Verify cart count updates
  await expect(
    page.getByTestId('cart-count')
  ).toHaveText('1');

  // Navigate to cart
  await page.goto('/cart');

  // Verify product is in cart
  await expect(
    page.getByText('Aurora Wireless Headphones')
  ).toBeVisible();

  // Remove product
  await page.getByTestId('cart-remove').click();

  // Verify product is no longer displayed
  await expect(
    page.getByText('Aurora Wireless Headphones')
  ).toBeHidden();

  // Verify cart count returns to zero
  await expect(
    page.getByTestId('cart-count')
  ).toHaveText('0');
});
