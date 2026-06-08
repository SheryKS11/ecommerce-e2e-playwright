import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// TC29
Then('the search input should be visible', async function (this: CustomWorld) {
  const searchInput = this.page.locator('input[name="search"]').first();
  await expect(searchInput).toBeVisible();
});

// TC30 - GOOD: uses Playwright auto-waiting (stable)
Then('the search results page should display matching products using auto-waiting assertions', async function (this: CustomWorld) {
  const products = this.page.locator('.product-thumb');
  await expect(products.first()).toBeVisible();
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
});

// TC30 - Reliability — fixed-sleep anti-pattern (deterministic failure for demonstration)
Then('the search results page should display matching products using a fixed sleep', async function (this: CustomWorld) {
  await this.page.waitForTimeout(100); // BAD: 100ms reliably elapses before products render → assertion fails every run (deterministic anti-pattern)
  //Right Way: await expect(this.page.locator(".product-thumb").first()).toBeVisible();
  const products = this.page.locator('.product-thumb');
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
});
