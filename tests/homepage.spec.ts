import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Wellness Pure Life/);
});

test('homepage shows main nav', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('nav')).toBeVisible();
});

test('homepage shows Sign Up and Login buttons', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('button', { hasText: 'Sign Up' }).first()).toBeVisible();
  await expect(page.locator('button', { hasText: 'Login' }).first()).toBeVisible();
});

test('homepage Start Quiz button is visible', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('button', { hasText: 'Start Quiz' })).toBeVisible();
});

test('homepage Premium button is visible', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('button', { hasText: 'Premium' })).toBeVisible();
});