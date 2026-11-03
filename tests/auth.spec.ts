
import { test, expect } from '@playwright/test';

// TEST 1: Register a new user with valid details
test('User can register with valid details', async ({ page }) => {
  const email = `qa+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const password = 'TestPassword123!';

  // Navigate to registration page
  await page.goto('/register');

  // Fill in all required registration fields
  await page.getByLabel('Full name').fill('QA Test User');
  await page.getByTestId('register-email').fill(email);
  await page.getByTestId('register-password').fill(password);
  await page.getByLabel('Confirm password').fill(password);

  // Submit registration
  await page.getByTestId('register-submit').click();

  // Verify successful registration
  await expect(
    page.getByTestId('logout-button')
  ).toBeVisible({ timeout: 10000 });
});

// TEST 2: Log in with an existing account
test('User can log in with valid credentials', async ({ page }) => {
  // Read test account credentials from .env
  const email = process.env.SHOPFLOW_TEST_EMAIL;
  const password = process.env.SHOPFLOW_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing SHOPFLOW_TEST_EMAIL or SHOPFLOW_TEST_PASSWORD in .env'
    );
  }

  // Navigate to login page
  await page.goto('/login');

  // Verify login page is displayed
  await expect(
    page.getByRole('heading', { name: 'Welcome back' })
  ).toBeVisible();

  // Enter existing account credentials
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);

  // Verify both fields contain the correct values
  await expect(
    page.getByTestId('login-email')
  ).toHaveValue(email);

  await expect(
    page.getByTestId('login-password')
  ).toHaveValue(password);

  // Submit login form
  await page.getByTestId('login-submit').click();

  // Verify successful login redirects to products page
  await expect(page).toHaveURL(/\/products\/?$/, {
    timeout: 10000
  });

  // Verify user is authenticated
  await expect(
    page.getByTestId('logout-button')
  ).toBeVisible();

  // Verify Sign in link is no longer displayed
  await expect(
    page.getByRole('link', { name: 'Sign in' })
  ).toBeHidden();
});

test('User cannot log in with an incorrect password', async ({ page }) => {
  const email = process.env.SHOPFLOW_TEST_EMAIL;

  if (!email) {
    throw new Error('Missing SHOPFLOW_TEST_EMAIL in .env');
  }

  // Navigate to login page
  await page.goto('/login');

  // Enter valid email but incorrect password
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill('WrongPassword123!');

  // Submit login
  await page.getByTestId('login-submit').click();

  // Verify login is rejected
  await expect(page).toHaveURL(/\/login\/?\??$/);

  // Verify user is not authenticated
  await expect(
    page.getByTestId('logout-button')
  ).toBeHidden();
});

test('User cannot log in with empty fields', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Leave email and password empty
  await expect(page.getByTestId('login-email')).toBeEmpty();
  await expect(page.getByTestId('login-password')).toBeEmpty();

  // Click Sign in
  await page.getByTestId('login-submit').click();

  // Verify the user remains on the login page
  await expect(page).toHaveURL(/\/login\/?\??$/);

  // Verify the user is not authenticated
  await expect(
    page.getByTestId('logout-button')
  ).toBeHidden();
});