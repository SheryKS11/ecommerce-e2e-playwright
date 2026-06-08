import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class WishlistComparePage extends BasePage {
  async openCompare() {
    await this.navigate('index.php?route=product/compare');
    await this.page.waitForLoadState('networkidle');
  }

  async getCompareProductCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle');
    // Each product in the compare table has a "Remove" link
    const removeLinks = this.page.locator('a[href*="route=product/compare&remove"], a[href*="compare&remove"]');
    const count = await removeLinks.count();
    if (count > 0) return count;
    // Fallback: count product image cells in the first data row
    const cells = this.page.locator('#content table tbody tr').first().locator('td');
    return cells.count();
  }
}
