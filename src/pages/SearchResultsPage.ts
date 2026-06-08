import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  private productCards = () => this.page.locator('.product-thumb');
  private noResultsMsg = () => this.page.locator('#content p').filter({ hasText: /no product that matches/i });
  private sortSelect = () => this.page.locator('.content-sort-by select').first();
  private productPrices = () => this.page.locator('.price-new, .price');

  async getProductCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    await this.productCards().first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return this.productCards().count();
  }

  async hasNoResultsMessage(): Promise<boolean> {
    return this.noResultsMsg().isVisible();
  }

  async sortBy(option: string) {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    await this.sortSelect().waitFor({ state: 'visible', timeout: 10000 });
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }),
      this.sortSelect().selectOption({ label: option }),
    ]);
  }

  async getPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices().allInnerTexts();
    return priceTexts
      .map(t => parseFloat(t.replace(/[^0-9.]/g, '')))
      .filter(n => !isNaN(n));
  }

  async filterInStock() {
    await this.page.locator('label[for="mz-fss-0--1"]').click();
    await Promise.race([
      this.page.waitForResponse(
        resp => resp.url().includes('route=product/search') && resp.status() === 200,
        { timeout: 10000 }
      ),
      this.page.waitForLoadState('networkidle', { timeout: 10000 }),
    ]);
  }

  async clickFirstProduct() {
    await this.productCards().first().click();
  }

  async clickFirstInStockProduct() {
    await this.filterInStock();
    await this.productCards().first().waitFor({ state: 'visible', timeout: 10000 });
    await this.productCards().first().click();
  }

  async isPageLoaded(): Promise<boolean> {
    return this.page.locator('#product-search, #content').first().isVisible();
  }
}
