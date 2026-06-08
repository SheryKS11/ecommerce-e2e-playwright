import { Page } from 'playwright';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path = '') {
    await this.page.goto(`https://ecommerce-playground.lambdatest.io/${path}`);
  }

  async getAlertText(): Promise<string> {
    const alert = this.page.locator('.alert');
    await alert.waitFor({ state: 'visible' });
    return alert.innerText();
  }

  async dismissAlert() {
    const closeBtn = this.page.locator('.alert .btn-close, .alert button[data-dismiss]');
    if (await closeBtn.isVisible()) await closeBtn.click();
  }
}
