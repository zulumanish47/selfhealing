import { LLMClient } from './LLMClient';
import { LocatorSuggestions } from '../models/LocatorSuggestions';

export class LocatorHealer {
  constructor(private llmClient: LLMClient) {}

  async getHealedLocators(
    pageSource: string,
    locatorType: string,
    originalLocator: string
  ): Promise<LocatorSuggestions | null> {
    const prompt = `
The Web element with locatorType: ${locatorType} and locator "${originalLocator}" cannot be found on the page.
Based on the current page source, suggest alternative locators that might work.

IMPORTANT: Return ONLY a valid JSON object with these keys:
- id: element id attribute
- name: element name attribute
- xpath: XPath selector
- cssSelector: CSS selector
- className: CSS class name
- linkText: link text (for <a> elements)
- role: ARIA role for Playwright getByRole()
- testId: data-testid attribute for Playwright getByTestId()
- placeholder: placeholder text for Playwright getByPlaceholder()

Format as proper JSON with double quotes. Do not include any text before or after the JSON object.
Do not include explanations or comments, just return the JSON object.

Page source (truncated): ${pageSource.substring(0, 5000)}
`;

    try {
      const response = await this.llmClient.getCompletion(prompt);

      // Clean response (remove markdown code blocks if present)
      const cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '') // Remove text before first {
        .replace(/[^}]*$/, '') // Remove text after last }
        .trim();

      return JSON.parse(cleaned) as LocatorSuggestions;
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return null;
    }
  }
}
