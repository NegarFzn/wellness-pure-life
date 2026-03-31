import { test, expect } from '@playwright/test';

// ─── SIGNUP ───────────────────────────────────────────────

test('signup modal opens via /signup page', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await expect(page.locator('text=Join Wellness Pure Life')).toBeVisible();
});

test('signup modal has all required fields', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Your Email"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Create Password"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Confirm Password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]', { hasText: 'Sign Up Free' })).toBeVisible();
});

test('signup shows error when passwords do not match', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.fill('input[placeholder="Name"]', 'Test User');
  await page.fill('input[placeholder="Your Email"]', 'test@example.com');
  await page.fill('input[placeholder="Create Password"]', 'password123');
  await page.fill('input[placeholder="Confirm Password"]', 'differentpassword');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Passwords do not match')).toBeVisible({ timeout: 10000 });
});

test('signup modal close button exists', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await expect(page.locator('button[class*="close"]')).toBeVisible();
});

// ─── LOGIN ────────────────────────────────────────────────

test('login page loads with correct fields', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('text=Login to Wellness Pure Life')).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]', { hasText: 'Login' })).toBeVisible();
});

test('login shows forgot password button', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('button', { hasText: 'Forgot your password?' })).toBeVisible();
});

test('login has link to signup page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('a[href="/signup"]')).toBeVisible();
});

test('login with wrong credentials shows error', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'wrong@example.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  // Should show an error (not redirect)
  await expect(page.locator('p.error, [class*="error"]')).toBeVisible({ timeout: 8000 });
});