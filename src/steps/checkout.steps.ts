import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { GUEST_USER } from '../fixtures/testData';

// TC22
When('I proceed to checkout as a guest', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
  await this.checkoutPage.selectGuestCheckout();
});

When('I fill in the guest billing details', async function (this: CustomWorld) {
  await this.checkoutPage.fillBillingDetails(GUEST_USER);
  await this.checkoutPage.continueShipping();
});

When('I proceed to checkout as a registered user', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
  await this.page.waitForLoadState('networkidle');
});

When('I fill in the billing details', async function (this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
  // If #payment-new is visible, billing needs to be filled; otherwise an existing address is pre-selected
  const paymentNew = this.page.locator('#payment-new');
  const needsFilling = await paymentNew.isVisible().catch(() => false);
  if (needsFilling) {
    await this.checkoutPage.fillBillingDetails(GUEST_USER);
  }
});

When('I continue through shipping and payment steps', async function (this: CustomWorld) {
  await this.checkoutPage.continueShippingMethod();
  await this.checkoutPage.continuePaymentMethod();
});

When('I confirm the order', async function (this: CustomWorld) {
  await this.checkoutPage.confirmOrder();
});

Then('I should see the order confirmation page', async function (this: CustomWorld) {
  const isConfirmed = await this.checkoutPage.isOrderConfirmed();
  expect(isConfirmed).toBeTruthy();
});

// TC24 - already on checkout form from previous step "I proceed to checkout as a guest"
When('I submit the billing form with empty required fields', async function (this: CustomWorld) {
  await this.checkoutPage.submitEmptyForm();
});

Then('validation should block progression to the next step', async function (this: CustomWorld) {
  const hasError = await this.checkoutPage.hasValidationError();
  expect(hasError).toBeTruthy();
});
