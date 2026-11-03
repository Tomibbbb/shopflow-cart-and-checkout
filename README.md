# ShopFlow — Playwright QA Automation Project

## About the Project

I created this project to practise and demonstrate my QA automation skills using Playwright and TypeScript.

ShopFlow is a demo e-commerce website built with Lovable. I use it to test common shopping journeys, from registering and logging in to searching for products, managing a shopping cart and completing checkout.

**Website:** https://shopflow-cart-and-checkout.lovable.app/

## Tools Used

- Playwright
- TypeScript
- Node.js
- VS Code
- Git and GitHub

The tests run in Chromium, Firefox and WebKit.

## What I've Automated

I've written 13 automated tests covering the main shopping features.

| Area | What's Tested |
|---|---|
| Registration and Login | Successful registration, valid login, incorrect password and empty login fields |
| Products | Searching for a product and filtering by category |
| Shopping Cart | Adding products, changing quantities and removing products |
| Checkout | Completing a simulated purchase and checking the order confirmation |

## Test Results

The latest full test run passed across all three browsers.

| Browser | Passed |
|---|---|
| Chromium | 13 |
| Firefox | 13 |
| WebKit | 13 |
| **Total** | **39** |

## Test Execution and Debugging

I used Playwright's HTML reports and trace viewer to review test results and investigate failures during development.

I also ran tests multiple times across different browsers to check consistency and identify areas where test reliability could be improved.

My latest full execution completed successfully, with all 39 test executions passing across Chromium, Firefox and WebKit.

## How to Run the Tests

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Set Up Test Credentials

Create a `.env` file in the project folder and add:

```env
SHOPFLOW_TEST_EMAIL=your-test-email@example.com
SHOPFLOW_TEST_PASSWORD=your-test-password
```

Use a dedicated test account. The `.env` file should not be committed to GitHub.

### 3. Run All Tests

```bash
npx playwright test
```

### 4. Run Tests in One Browser

```bash
npx playwright test --project=chromium
```

### 5. View the Test Report

```bash
npx playwright show-report
```

## What I Plan to Improve

- Add more negative test scenarios
- Improve test reliability
- Set up GitHub Actions to run tests automatically
- Continue expanding checkout and cart test coverage

## About ShopFlow

The ShopFlow application was built using [Lovable](https://lovable.dev) with React, TypeScript and Tailwind CSS.

The website uses demo products and a simulated checkout, so no real payments are processed.