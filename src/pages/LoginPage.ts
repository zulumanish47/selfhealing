import { Page, Locator } from '@playwright/test';
import { findSelfHealingElement } from '../core/PlaywrightExtensions';

export class LoginPage {
  constructor(private page: Page) {}

  private async getUsernameField(): Promise<Locator> {
    return await findSelfHealingElement(this.page, '#UserName');
  }

  private async getPasswordField(): Promise<Locator> {
    return await findSelfHealingElement(this.page, '#Password');
  }

  private async getLoginButton(): Promise<Locator> {
    return await findSelfHealingElement(this.page, 'input[type="submit"]');
  }

  async login(username: string, password: string): Promise<void> {
    const usernameField = await this.getUsernameField();
    await usernameField.fill(username);

    const passwordField = await this.getPasswordField();
    await passwordField.fill(password);

    const loginButton = await this.getLoginButton();
    await loginButton.click();
  }
}
