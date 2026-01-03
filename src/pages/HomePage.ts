import { Page, Locator } from '@playwright/test';
import { findSelfHealingElement } from '../core/PlaywrightExtensions';

export class HomePage {
  constructor(private page: Page) {}

  private async getLoginLink(): Promise<Locator> {
    return await findSelfHealingElement(this.page, 'text=Login');
  }

  private async getEmployeeDetailsLink(): Promise<Locator> {
    return await findSelfHealingElement(this.page, 'text=Employee Details');
  }

  private async getManageUsersLink(): Promise<Locator> {
    return await findSelfHealingElement(this.page, 'text=Manage Users');
  }

  private async getLogoffLink(): Promise<Locator> {
    return await findSelfHealingElement(this.page, 'text=Log off');
  }

  async clickLogin(): Promise<void> {
    const link = await this.getLoginLink();
    await link.click();
  }

  async clickEmployeeDetails(): Promise<void> {
    const link = await this.getEmployeeDetailsLink();
    await link.click();
  }

  async clickManageUsers(): Promise<void> {
    const link = await this.getManageUsersLink();
    await link.click();
  }

  async clickLogoff(): Promise<void> {
    const link = await this.getLogoffLink();
    await link.click();
  }
}
