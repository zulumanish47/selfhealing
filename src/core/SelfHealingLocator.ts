import { Page, Locator } from '@playwright/test';
import { LocatorHealer } from '../llm/LocatorHealer';
import { createLLMClient } from '../llm/LLMClientFactory';
import { loadConfig } from '../config/ConfigLoader';

export interface SelfHealingOptions {
  maxRetries?: number;
  enableAI?: boolean;
}

export class SelfHealingLocator {
  private locatorStrategies: Map<string, string> = new Map();
  private currentStrategy: string;
  private locatorHealer: LocatorHealer;

  constructor(
    private page: Page,
    primarySelector: string,
    private options: SelfHealingOptions = {}
  ) {
    this.currentStrategy = primarySelector;
    this.locatorStrategies.set('primary', primarySelector);

    const config = loadConfig();
    const llmClient = createLLMClient(config);
    this.locatorHealer = new LocatorHealer(llmClient);
  }

  async getLocator(retryAttempts?: number): Promise<Locator> {
    const maxRetries = retryAttempts ?? this.options.maxRetries ?? 2;

    // Step 1: Try current strategy
    const currentLocator = await this.tryCurrentStrategy();
    if (currentLocator) return currentLocator;

    // Step 2: Try alternative strategies
    const altLocator = await this.tryAlternativeStrategies();
    if (altLocator) return altLocator;

    // Step 3: AI healing
    if (maxRetries > 0 && this.options.enableAI !== false) {
      console.log(`Attempting AI healing (${maxRetries} attempts remaining)`);
      await this.healUsingAI();
      return await this.getLocator(maxRetries - 1);
    }

    throw new Error(
      `Failed to locate element with selector "${this.currentStrategy}" after all healing attempts`
    );
  }

  private async tryCurrentStrategy(): Promise<Locator | null> {
    try {
      const locator = this.page.locator(this.currentStrategy);
      // Check if element exists with short timeout
      await locator.waitFor({ timeout: 3000 });
      return locator;
    } catch {
      return null;
    }
  }

  private async tryAlternativeStrategies(): Promise<Locator | null> {
    if (this.locatorStrategies.size <= 1) return null;

    for (const [strategyName, selector] of this.locatorStrategies.entries()) {
      if (selector === this.currentStrategy) continue;

      try {
        const locator = this.page.locator(selector);
        await locator.waitFor({ timeout: 3000 });

        console.log(`Alternative strategy succeeded: ${strategyName} - ${selector}`);
        this.currentStrategy = selector;
        return locator;
      } catch {
        // Continue to next strategy
      }
    }

    return null;
  }

  private async healUsingAI(): Promise<void> {
    try {
      const { locatorType, locatorValue } = this.parseSelector(this.currentStrategy);
      const pageSource = await this.page.content();

      const suggestions = await this.locatorHealer.getHealedLocators(
        pageSource,
        locatorType,
        locatorValue
      );

      if (!suggestions) {
        console.log('AI healing returned no suggestions');
        return;
      }

      let addedCount = 0;
      addedCount += this.tryAddLocatorStrategy('id', suggestions.id);
      addedCount += this.tryAddLocatorStrategy('xpath', suggestions.xpath);
      addedCount += this.tryAddLocatorStrategy('css', suggestions.cssSelector);
      addedCount += this.tryAddLocatorStrategy('name', suggestions.name);
      addedCount += this.tryAddLocatorStrategy('class', suggestions.className);
      addedCount += this.tryAddLocatorStrategy('text', suggestions.linkText);

      // Playwright-specific selectors
      addedCount += this.tryAddLocatorStrategy('role', suggestions.role);
      addedCount += this.tryAddLocatorStrategy('testId', suggestions.testId);
      addedCount += this.tryAddLocatorStrategy('placeholder', suggestions.placeholder);

      console.log(`AI healing completed: ${addedCount} alternative locators added`);
    } catch (error) {
      console.error('AI healing failed:', error);
    }
  }

  private parseSelector(selector: string): { locatorType: string; locatorValue: string } {
    // Handle Playwright selector syntax: role=button[name="Submit"]
    if (selector.includes('=')) {
      const [type, value] = selector.split('=');
      return { locatorType: type, locatorValue: value };
    }

    // Handle CSS selectors
    if (selector.startsWith('#')) {
      return { locatorType: 'id', locatorValue: selector.substring(1) };
    }
    if (selector.startsWith('.')) {
      return { locatorType: 'class', locatorValue: selector.substring(1) };
    }
    if (selector.startsWith('//')) {
      return { locatorType: 'xpath', locatorValue: selector };
    }

    return { locatorType: 'css', locatorValue: selector };
  }

  private tryAddLocatorStrategy(locatorType: string, locatorValue?: string): number {
    if (!locatorValue || !locatorValue.trim()) return 0;

    try {
      let selector: string;

      switch (locatorType.toLowerCase()) {
        case 'id':
          selector = `#${locatorValue}`;
          break;
        case 'name':
          selector = `[name="${locatorValue}"]`;
          break;
        case 'class':
        case 'classname':
          selector = `.${locatorValue}`;
          break;
        case 'css':
        case 'cssselector':
          selector = locatorValue;
          break;
        case 'xpath':
          selector = locatorValue;
          break;
        case 'text':
        case 'linktext':
          selector = `text=${locatorValue}`;
          break;
        case 'role':
          selector = `role=${locatorValue}`;
          break;
        case 'testid':
          selector = `data-testid=${locatorValue}`;
          break;
        case 'placeholder':
          selector = `placeholder=${locatorValue}`;
          break;
        default:
          return 0;
      }

      this.locatorStrategies.set(locatorType, selector);
      return 1;
    } catch {
      return 0;
    }
  }
}
