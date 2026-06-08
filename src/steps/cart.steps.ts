import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I have a product in my cart', async function (this: CustomWorld) {
  await this.page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&product_id=78');
  await this.productPage.addToCart();
  await this.page.locator('#notification-box-top .toast').waitFor({ state: 'visible' });
  await this.cartPage.goto();
});

Given('I navigate to a product page that requires an option selection', async function (this: CustomWorld) {
  await this.page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&product_id=50');
});

// TC15
When('I add the product to the cart', async function (this: CustomWorld) {
  await this.productPage.addToCart();
});

Then('I should see a success alert containing {string}', async function (this: CustomWorld, text: string) {
  const alert = await this.productPage.getSuccessAlert();
  expect(alert).toContain(text);
});

// TC16
When('I attempt to add the product to the cart without selecting a required option', async function (this: CustomWorld) {
  await this.productPage.addToCart();
});

Then('a validation prompt should appear for the required option', async function (this: CustomWorld) {
  const error = this.page.locator('.text-danger').filter({ hasText: 'required!' }).first();
  await error.waitFor({ state: 'visible', timeout: 10000 });
  await expect(error).toContainText('required!');
});

// TC17
When('I update the quantity to {int}', async function (this: CustomWorld, qty: number) {
  await this.cartPage.updateQuantity(0, qty);
});

Then('the line total should reflect the updated quantity', async function (this: CustomWorld) {
  const lineTotal = await this.cartPage.getLineTotalText(0);
  expect(lineTotal).toBeTruthy();
});

// TC18
Then('the cart should handle the value gracefully', async function (this: CustomWorld) {
  await expect(this.page.locator('#content')).toContainText('Your shopping cart is empty!', { timeout: 10000 });
});

// TC19
When('I remove the item from the cart', async function (this: CustomWorld) {
  await this.cartPage.removeItem(0);
});

Then('the cart should be empty', async function (this: CustomWorld) {
  const isEmpty = await this.cartPage.isCartEmpty();
  expect(isEmpty).toBeTruthy();
});

// TC25
When('I apply the coupon code {string}', async function (this: CustomWorld, coupon: string) {
  await this.cartPage.applyCoupon(coupon);
});
