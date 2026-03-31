import { test, expect } from '@playwright/test';

test('Fitness nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/fitness"]');
  await expect(page).toHaveURL(/\/fitness/);
});

test('Mindfulness nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/mindfulness"]');
  await expect(page).toHaveURL(/\/mindfulness/);
});

test('Nourish nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/nourish"]');
  await expect(page).toHaveURL(/\/nourish/);
});

test('Blog nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/blog"]');
  await expect(page).toHaveURL(/\/blog/);
});

test('News nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/news"]');
  await expect(page).toHaveURL(/\/news/);
});

test('Contact nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/contact"]');
  await expect(page).toHaveURL(/\/contact/);
});

test('Challenges nav link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/challenges"]');
  await expect(page).toHaveURL(/\/challenges/);
});

test('logo click goes back to homepage', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  await page.click('a[href="/"]');
  await expect(page).toHaveURL('http://localhost:3000/');
});