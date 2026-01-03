import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { LoginPage } from '../src/pages/LoginPage';
import { SelfHealingLocator } from '../src/core/SelfHealingLocator';

test.describe('Enhanced Self-Healing Tests', () => {
  test('Traditional workflow test', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Use enhanced page objects with self-healing elements
    const homePage = new HomePage(page);
    await homePage.clickLogin();

    const loginPage = new LoginPage(page);
    await loginPage.login('admin', 'password');

    // Click Employee Details
    await homePage.clickEmployeeDetails();

    await homePage.clickManageUsers();

    await homePage.clickLogoff();

    // Optional: Add assertions to verify success
    await expect(page).toHaveURL(/.*eaapp.somee.com/);
  });

  test('Direct self-healing locator test', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Direct usage of SelfHealingLocator
    const selfHealingLocator = new SelfHealingLocator(page, 'text=Login');
    const loginLink = await selfHealingLocator.getLocator();
    await loginLink.click();

    // Verify navigation to login page
    await expect(page).toHaveURL(/.*Login/);
  });
});
