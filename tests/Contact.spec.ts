import { test, expect } from '@playwright/test';

test('contact page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await expect(page).toHaveTitle(/Contact/);
  await expect(page.locator('h1', { hasText: 'Contact Us' })).toBeVisible();
});

test('contact form has all required fields', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('contact form fields accept input', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await page.fill('input[name="name"]', 'Negar Test');
  await page.fill('input[name="email"]', 'negar@example.com');
  await page.fill('textarea[name="message"]', 'This is a test message.');
  await expect(page.locator('input[name="name"]')).toHaveValue('Negar Test', { timeout: 10000 });
  await expect(page.locator('input[name="email"]')).toHaveValue('negar@example.com', { timeout: 10000 });
  await expect(page.locator('textarea[name="message"]')).toHaveValue('This is a test message.', { timeout: 10000 });
});