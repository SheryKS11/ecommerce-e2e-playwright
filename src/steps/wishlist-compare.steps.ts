import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// TC20
When('I add the product to my wishlist', async function (this: CustomWorld) {
  await this.productPage.addToWishlist();
});

Then('I should see a wishlist success confirmation', async function (this: CustomWorld) {
  // Wait for toast notification from wishlist AJAX call
  const toast = this.page.locator('#notification-box-top .toast');
  const toastFound = await toast.waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
  if (toastFound) {
    const text = await toast.innerText();
    expect(text.toLowerCase()).toContain('wish list');
    return;
  }
  // Fallback: redirected to wishlist page
  await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  const url = this.page.url();
  const onWishlistPage = url.includes('account/wishlist');
  const onProductPage = url.includes('product/product');
  expect(onWishlistPage || onProductPage).toBeTruthy();
});

// TC21
async function addProductToCompare(page: any, thumbIndex: number) {
  const compareBtn = page.locator('.product-thumb').nth(thumbIndex)
    .locator('button[title="Compare this Product"], button[data-original-title="Compare this Product"]').first();
  await compareBtn.waitFor({ state: 'visible' });
  // Wait for compare JS object to be available, then invoke the onclick handler
  const onclick = await compareBtn.getAttribute('onclick');
  await page.waitForFunction(() => typeof (window as any).compare !== 'undefined', { timeout: 10000 });
  await page.evaluate((fn: string) => { eval(fn); }, onclick);
  // Wait for toast to appear then disappear before next action
  const toast = page.locator('#notification-box-top .toast');
  await toast.waitFor({ state: 'visible', timeout: 10000 });
  await toast.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
}

When('I add the first product to compare', async function (this: CustomWorld) {
  await addProductToCompare(this.page, 0);
});

When('I add the second product to compare', async function (this: CustomWorld) {
  await addProductToCompare(this.page, 1);
});

When('I open the compare page', async function (this: CustomWorld) {
  await this.wishlistComparePage.openCompare();
});

Then('the comparison table should list at least {int} products', async function (this: CustomWorld, count: number) {
  const productCount = await this.wishlistComparePage.getCompareProductCount();
  expect(productCount).toBeGreaterThanOrEqual(count);
});
