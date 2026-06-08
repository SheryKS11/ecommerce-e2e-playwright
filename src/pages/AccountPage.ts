import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  private editAccountLink = () => this.page.getByRole('link', { name: /edit account/i });
  private firstNameInput = () => this.page.getByLabel('First Name');
  private continueBtn = () => this.page.locator('input[type="submit"], button[type="submit"]').last();
  private newsletterLink = () => this.page.locator('a[href*="route=account/newsletter"]').first();
  private newsletterYes = () => this.page.locator('label[for="input-newsletter-yes"]');
  private newsletterNo = () => this.page.locator('label[for="input-newsletter-no"]');

  async goto() {
    await this.navigate('index.php?route=account/account');
  }

  async editFirstName(newName: string) {
    await this.editAccountLink().click();
    await this.firstNameInput().fill('');
    await this.firstNameInput().fill(newName);
    await this.continueBtn().click();
  }

  async getSuccessAlert(): Promise<string> {
    const alert = this.page.locator('.alert-success');
    await alert.waitFor({ state: 'visible' });
    return alert.innerText();
  }

  async toggleNewsletter(subscribe: boolean) {
    await this.newsletterLink().click();
    const yesChecked = await this.page.locator('#input-newsletter-yes').isChecked();
    if (yesChecked) {
      await this.newsletterNo().click();
    } else {
      await this.newsletterYes().click();
    }
    await this.continueBtn().click();
  }
}
