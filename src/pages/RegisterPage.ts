import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  private firstName = () => this.page.locator('#input-firstname');
  private lastName = () => this.page.locator('#input-lastname');
  private email = () => this.page.locator('#input-email');
  private telephone = () => this.page.locator('#input-telephone');
  private password = () => this.page.locator('#input-password');
  private confirmPassword = () => this.page.locator('#input-confirm');
  private privacyPolicy = () => this.page.locator('label[for="input-agree"]');
  private submitBtn = () => this.page.getByRole('button', { name: /continue/i });

  async goto() {
    await this.navigate('index.php?route=account/register');
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.firstName().fill(data.firstName);
    await this.lastName().fill(data.lastName);
    await this.email().fill(data.email);
    await this.telephone().fill(data.telephone);
    await this.password().fill(data.password);
    await this.confirmPassword().fill(data.confirmPassword);
  }

  async agreeToPrivacyPolicy() {
    await this.privacyPolicy().click();
  }

  async submit() {
    await this.submitBtn().click();
  }

  async getSuccessHeading(): Promise<string> {
    const heading = this.page.getByRole('heading', { name: /your account has been created/i });
    await heading.waitFor({ state: 'visible' });
    return heading.innerText();
  }

  async getValidationErrors(): Promise<string[]> {
    const errors = this.page.locator('.text-danger');
    await errors.first().waitFor({ state: 'visible' });
    return errors.allInnerTexts();
  }
}
