import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private addToCartBtn = () => this.page.locator('button.btn-cart[title="Add to Cart"]').first();
  private addToWishlistBtn = () => this.page.locator('button[title="Add to Wish List"], button[data-original-title="Add to Wish List"]').first();
  private addToCompareBtn = () => this.page.locator('button[title="Compare this Product"], button[data-original-title="Compare this Product"]').first();
  private productTitle = () => this.page.locator('h1').first();
  private productPrice = () => this.page.locator('.price-new, .price').first();
  private productImage = () => this.page.locator('#entry_216825 img, .product-image img, #content img').first();

  async addToCart() {
    await this.addToCartBtn().waitFor({ state: 'attached' });
    await this.addToCartBtn().dispatchEvent('click');
  }

  async addToWishlist() {
    await this.addToWishlistBtn().waitFor({ state: 'visible' });
    // Get the onclick attribute and execute it directly to trigger AJAX
    const onclick = await this.addToWishlistBtn().getAttribute('onclick');
    if (onclick) {
      await this.page.waitForFunction(
        () => typeof (window as any).wishlist !== 'undefined',
        { timeout: 10000 }
      );
      await this.page.evaluate((fn: string) => { eval(fn); }, onclick);
    } else {
      await this.addToWishlistBtn().dispatchEvent('click');
    }
  }

  async addToCompare() {
    await this.addToCompareBtn().click();
  }

  async getProductTitle(): Promise<string> {
    return this.productTitle().innerText();
  }

  async isDetailPageLoaded(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    await this.productTitle().waitFor({ state: 'visible', timeout: 10000 });
    const titleVisible = await this.productTitle().isVisible();
    const priceVisible = await this.productPrice().isVisible();
    return titleVisible && priceVisible;
  }

  async getSuccessAlert(): Promise<string> {
    const toast = this.page.locator('#notification-box-top .toast');
    await toast.waitFor({ state: 'visible' });
    return toast.innerText();
  }
}
