import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private cartRows = () => this.page.locator('#content tbody tr');
  private quantityInputs = () => this.page.locator('input[name^="quantity"]');
  private updateBtns = () => this.page.locator('button[title="Update"], button[data-original-title="Update"]');
  private removeBtns = () => this.page.locator('button[title="Remove"], button[data-original-title="Remove"]');
  private couponAccordion = () => this.page.locator('[data-target="#collapse-coupon"]');
  private couponPanel = () => this.page.locator('#collapse-coupon');
  private couponInput = () => this.page.locator('#input-coupon');
  private couponApplyBtn = () => this.page.locator('#button-coupon');
  private checkoutBtn = () => this.page.getByRole('link', { name: /checkout/i });
  private emptyCartMsg = () => this.page.locator('#content').filter({ hasText: /your shopping cart is empty/i });

  async goto() {
    await this.navigate('index.php?route=checkout/cart');
  }

  async getRowCount(): Promise<number> {
    return this.cartRows().count();
  }

  async updateQuantity(index: number, qty: number) {
    const inputs = this.quantityInputs();
    await inputs.nth(index).fill(String(qty));
    await this.updateBtns().nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getQuantityValue(index: number): Promise<string> {
    return this.quantityInputs().nth(index).inputValue();
  }

  async removeItem(index: number) {
    await this.removeBtns().nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyCoupon(code: string) {
    // Expand the coupon accordion if not already open
    const panel = this.couponPanel();
    const isOpen = await panel.evaluate(el => el.classList.contains('show'));
    if (!isOpen) {
      await this.couponAccordion().click();
      await panel.waitFor({ state: 'visible' });
    }
    await this.couponInput().fill(code);
    await this.couponApplyBtn().click();
  }

  async getAlertText(): Promise<string> {
    const alert = this.page.locator('#collapse-coupon .alert, .alert-dismissible');
    await alert.waitFor({ state: 'visible', timeout: 10000 });
    return alert.innerText();
  }

  async isCartEmpty(): Promise<boolean> {
    return this.emptyCartMsg().isVisible();
  }

  async proceedToCheckout() {
    await this.checkoutBtn().click();
  }

  async getLineTotalText(index: number): Promise<string> {
    const cells = this.cartRows().nth(index).locator('td');
    return cells.last().innerText();
  }
}
