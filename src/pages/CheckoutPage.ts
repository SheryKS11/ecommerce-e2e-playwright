import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private guestRadio = () => this.page.getByLabel('Guest Checkout');
  private continueGuestBtn = () => this.page.locator('#button-account');
  private firstNameInput = () => this.page.locator('#input-payment-firstname');
  private lastNameInput = () => this.page.locator('#input-payment-lastname');
  private emailInput = () => this.page.locator('#input-payment-email');
  private telephoneInput = () => this.page.locator('#input-payment-telephone');
  private address1Input = () => this.page.locator('#input-payment-address-1');
  private cityInput = () => this.page.locator('#input-payment-city');
  private postcodeInput = () => this.page.locator('#input-payment-postcode');
  private countrySelect = () => this.page.locator('#input-payment-country');
  private regionSelect = () => this.page.locator('#input-payment-zone');
  private saveBtn = () => this.page.locator('#button-save');
  private agreeCheckbox = () => this.page.locator('input[name="agree"]');
  private confirmOrderBtn = () => this.page.locator('#button-confirm');

  async goto() {
    await this.navigate('index.php?route=checkout/checkout');
  }

  async selectGuestCheckout() {
    await this.page.waitForLoadState('networkidle');
    // Some OpenCart themes show a guest/returning customer step; others show the form directly
    const guestLabel = this.page.locator('label[for="input-account-guest"]');
    const hasGuestStep = await guestLabel.isVisible().catch(() => false);
    if (hasGuestStep) {
      await guestLabel.click();
      await this.page.waitForTimeout(300);
      const accountBtn = this.continueGuestBtn();
      const hasContinueBtn = await accountBtn.isVisible().catch(() => false);
      if (hasContinueBtn) {
        await accountBtn.click();
        await this.page.waitForLoadState('networkidle');
      }
    }
  }

  async fillBillingDetails(data: {
    firstName: string;
    lastName: string;
    email?: string;
    telephone: string;
    address1: string;
    city: string;
    postcode: string;
    country: string;
    region?: string;
  }) {
    await this.firstNameInput().fill(data.firstName);
    await this.lastNameInput().fill(data.lastName);
    // Email only exists on guest checkout form
    if (data.email) {
      const emailVisible = await this.emailInput().isVisible().catch(() => false);
      if (emailVisible) await this.emailInput().fill(data.email);
    }
    // Telephone: guest uses #input-payment-telephone, registered uses #input-telephone
    const paymentTelVisible = await this.telephoneInput().isVisible().catch(() => false);
    if (paymentTelVisible) {
      await this.telephoneInput().fill(data.telephone);
    } else {
      const tel = this.page.locator('#input-telephone');
      const telVisible = await tel.isVisible().catch(() => false);
      if (telVisible) await tel.fill(data.telephone);
    }
    await this.address1Input().fill(data.address1);
    await this.cityInput().fill(data.city);
    await this.postcodeInput().fill(data.postcode);
    await this.countrySelect().selectOption({ label: data.country });
    // Wait for zone dropdown to populate dynamically
    await this.page.waitForTimeout(1000);
    if (data.region) {
      await this.regionSelect().waitFor({ state: 'visible', timeout: 5000 });
      await this.regionSelect().selectOption({ label: data.region });
    }
    await this.page.waitForTimeout(300);
  }

  async continueShipping() {
    // Wait for #button-save to be enabled (zone AJAX may have disabled it)
    await this.saveBtn().waitFor({ state: 'visible' });
    await this.page.waitForFunction(() => {
      const btn = document.querySelector('#button-save') as HTMLButtonElement;
      return btn && !btn.disabled;
    }, { timeout: 10000 });
    // Label intercepts pointer events on the checkbox, so click the label instead
    await this.page.evaluate(() => {
      const cb = document.querySelector('#input-agree') as HTMLInputElement;
      if (cb && !cb.checked) cb.click();
    });
    await this.saveBtn().click();
    await this.page.waitForLoadState('networkidle');
  }

  async continueShippingMethod() {
    // No-op: shipping method is pre-selected on the single-page form
  }

  async continuePaymentMethod() {
    // No-op: payment method is pre-selected on the single-page form
  }

  async confirmOrder() {
    // If still on the form page (registered user flow), submit via #button-save first
    const saveVisible = await this.saveBtn().isVisible().catch(() => false);
    if (saveVisible) {
      // Wait for #button-save to be enabled (zone AJAX may have disabled it)
      await this.page.waitForFunction(() => {
        const btn = document.querySelector('#button-save') as HTMLButtonElement;
        return btn && !btn.disabled;
      }, { timeout: 10000 });
      await this.page.evaluate(() => {
      const cb = document.querySelector('#input-agree') as HTMLInputElement;
      if (cb && !cb.checked) cb.click();
    });
      await this.saveBtn().click();
      await this.page.waitForLoadState('networkidle');
    }
    // Wait up to 8s for #button-confirm to appear on the review page (if there is one)
    const confirmVisible = await this.confirmOrderBtn()
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
    if (confirmVisible) {
      await this.confirmOrderBtn().click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async isOrderConfirmed(): Promise<boolean> {
    return this.page.url().includes('checkout/success');
  }

  async getConfirmationHeading(): Promise<string> {
    const heading = this.page.getByRole('heading', { name: /your order has been placed/i });
    await heading.waitFor({ state: 'visible' });
    return heading.innerText();
  }

  async submitEmptyForm() {
    await this.saveBtn().click();
    await this.page.waitForTimeout(500);
  }

  async hasValidationError(): Promise<boolean> {
    await this.page.waitForTimeout(500);
    const errors = this.page.locator('.text-danger, .alert-danger, .has-error');
    const count = await errors.count();
    if (count === 0) return false;
    return errors.first().isVisible();
  }
}
