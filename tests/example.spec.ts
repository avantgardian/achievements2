import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page title is correct
  await expect(page).toHaveTitle(/AchievementTracker/);
  
  // Check that the main heading is visible
  await expect(page.getByRole('heading', { name: /Track Your Steam Achievements/ })).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Click on "My Games" link
  await page.getByRole('link', { name: 'My Games' }).click();
  
  // Should navigate to games page
  await expect(page).toHaveURL('/games');
});

test('auth page loads', async ({ page }) => {
  await page.goto('/auth');
  
  // Check that we're on the auth page
  await expect(page).toHaveURL('/auth');
}); 