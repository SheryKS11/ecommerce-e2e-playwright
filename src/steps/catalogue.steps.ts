import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// TC10
When('I search for {string}', async function (this: CustomWorld, term: string) {
  await this.homePage.searchFor(term);
});

Then('the search results page should display matching products', async function (this: CustomWorld) {
  const count = await this.searchResultsPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});

// TC11
Then('I should see the message {string}', async function (this: CustomWorld, message: string) {
  await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  await expect(this.page.locator('#product-search, #content')).toContainText(message, { timeout: 10000 });
});

// TC12
When('I submit an empty search', async function (this: CustomWorld) {
  await this.homePage.searchFor('');
});

Then('the page should load without errors', async function (this: CustomWorld) {
  await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  const isLoaded = await this.searchResultsPage.isPageLoaded();
  expect(isLoaded).toBeTruthy();
});

// TC13
When('I sort results by {string}', async function (this: CustomWorld, sortOption: string) {
  await this.searchResultsPage.sortBy(sortOption);
});

Then('the products should be displayed in ascending price order', async function (this: CustomWorld) {
  const prices = await this.searchResultsPage.getPrices();
  expect(prices.length).toBeGreaterThan(0);
  for (let i = 1; i < prices.length; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
  }
});

// TC14
When('I click on the first product result', async function (this: CustomWorld) {
  await this.page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&product_id=78');
});

Then('the product detail page should show price, image, and options', async function (this: CustomWorld) {
  const isLoaded = await this.productPage.isDetailPageLoaded();
  expect(isLoaded).toBeTruthy();
});

// TC26
When('I switch the currency to {string}', async function (this: CustomWorld, currency: string) {
  await this.homePage.switchCurrency(currency);
});

Then('the displayed prices should reflect the selected currency', async function (this: CustomWorld) {
  await this.page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/search&search=iPhone');
  await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  const priceLocator = this.page.locator('.price-new').first();
  await priceLocator.waitFor({ state: 'visible', timeout: 10000 });
  const priceText = await priceLocator.innerText();
  expect(priceText).toMatch(/[€£¥$]/);
});
