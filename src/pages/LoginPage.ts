import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private emailInput = () => this.page.getByLabel('E-Mail Address');
  private passwordInput = () => this.page.getByLabel('Password');
  private loginBtn = () => this.page.getByRole('button', { name: /login/i });

  async goto() {
    await this.navigate('index.php?route=account/login');
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginBtn().click();
  }

  async getWarningText(): Promise<string> {
    const warning = this.page.locator('.alert-danger');
    await warning.waitFor({ state: 'visible' });
    return warning.innerText();
  }

  async isOnAccountPage(): Promise<boolean> {
    return this.page.url().includes('account/account');
  }
}
