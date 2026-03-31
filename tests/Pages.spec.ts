import { test, expect } from '@playwright/test';

// ─── PREMIUM PAGE ─────────────────────────────────────────

test('premium page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/premium');
  await expect(page).toHaveTitle(/Premium|Pro/);
});

test('premium page has upgrade link', async ({ page }) => {
  await page.goto('http://localhost:3000/premium');
  await expect(page.locator('a[href="/upgrade"]').first()).toBeAttached();
});

test('premium page has quiz link', async ({ page }) => {
  await page.goto('http://localhost:3000/premium');
  await expect(page.locator('a[href="/quizzes/quiz-main"]')).toBeVisible();
});

// ─── BLOG PAGE ────────────────────────────────────────────

test('blog page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  await expect(page).toHaveTitle(/Blog/);
});

// ─── CHALLENGES PAGE ──────────────────────────────────────

test('challenges page loads with 3 challenge cards', async ({ page }) => {
  await page.goto('http://localhost:3000/challenges');
  await expect(page.locator('h1', { hasText: '21-Day Wellness Challenges' })).toBeVisible();
  await expect(page.locator('a[href="/challenges/21-days-fitness/1"]')).toBeVisible();
  await expect(page.locator('a[href="/challenges/21-days-mindfulness/1"]')).toBeVisible();
  await expect(page.locator('a[href="/challenges/21-days-nourish/1"]')).toBeVisible();
});

// ─── QUIZ PAGE ────────────────────────────────────────────

test('quiz main page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/quizzes/quiz-main');
  await expect(page).toHaveURL(/quiz-main/);
});

// ─── SEARCH PAGE ──────────────────────────────────────────

test('search works from header', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input[placeholder="Find your personalized wellness plan…"]', 'yoga');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/search\?q=yoga/);
});

// ─── ABOUT PAGE ───────────────────────────────────────────

test('about page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/about');
  await expect(page).toHaveTitle(/About/);
  await expect(page.locator('h1', { hasText: 'Wellness Pure Life' })).toBeVisible();
});

// ─── FAQ PAGE ─────────────────────────────────────────────

test('FAQ page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/faq');
  await expect(page).toHaveTitle(/FAQ/);
});

// ─── SAMPLE PAGES (for non-premium users) ─────────────────

test('sample weekly plan page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/sample/weekly-plan');
  await expect(page).toHaveURL(/sample\/weekly-plan/);
});

test('sample daily routine page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/sample/daily-routine');
  await expect(page).toHaveURL(/sample\/daily-routine/);
});