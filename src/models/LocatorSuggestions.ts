export interface LocatorSuggestions {
  id?: string;
  name?: string;
  xpath?: string;
  cssSelector?: string;
  className?: string;
  linkText?: string;
  role?: string;        // Playwright-specific: getByRole()
  testId?: string;      // Playwright-specific: getByTestId()
  placeholder?: string; // Playwright-specific: getByPlaceholder()
}
