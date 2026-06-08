import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private searchInput = () => this.page.locator('input[name="search"]').first();
  private searchButton = () => this.page.locator('button[type="submit"].type-text').first();
  private currencyDropdown = () => this.page.locator('button[class*="currency"]').first();
  private navMyAccount = () => this.page.getByRole('button', { name: /my account/i }).first();

  async goto() {
    await this.navigate();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async searchFor(term: string) {
    await this.searchInput().fill(term);
    await this.searchButton().click();
  }

  async switchCurrency(currency: string) {
    await this.page.evaluate((code) => {
      const form = document.querySelector('#form-currency') as HTMLFormElement;
      const input = form.querySelector('input[name="code"]') as HTMLInputElement;
      input.value = code;
      form.submit();
    }, currency);
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async openMyAccountMenu() {
    await this.navMyAccount().click();
  }

  async clickLogin() {
    await this.openMyAccountMenu();
    await this.page.getByRole('link', { name: /login/i }).click();
  }

  async clickRegister() {
    await this.openMyAccountMenu();
    await this.page.getByRole('link', { name: /register/i }).click();
  }

  async clickLogout() {
    await this.openMyAccountMenu();
    await this.page.getByRole('link', { name: /logout/i }).first().click();
  }
}
