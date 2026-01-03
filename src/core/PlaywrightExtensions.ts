import { Page, Locator } from '@playwright/test';
import { SelfHealingLocator, SelfHealingOptions } from './SelfHealingLocator';

export async function findSelfHealingElement(
  page: Page,
  selector: string,
  options?: SelfHealingOptions
): Promise<Locator> {
  const healer = new SelfHealingLocator(page, selector, options);
  return await healer.getLocator();
}

export async function clickSelfHealing(
  page: Page,
  selector: string,
  options?: SelfHealingOptions
): Promise<void> {
  const locator = await findSelfHealingElement(page, selector, options);
  await locator.click();
}

export async function fillSelfHealing(
  page: Page,
  selector: string,
  text: string,
  options?: SelfHealingOptions
): Promise<void> {
  const locator = await findSelfHealingElement(page, selector, options);
  await locator.fill(text);
}
