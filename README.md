# Playwright Self-Healing Tests with LLM

A TypeScript Playwright test framework featuring LLM-powered self-healing locators. This project automatically recovers from locator failures using a sophisticated 3-tier fallback strategy combined with AI healing.

**Migrated from C# Selenium to TypeScript Playwright**

## Features

- **3-Tier Fallback Strategy**: Primary locator → Alternative strategies → AI-powered healing
- **Dual LLM Provider Support**: Local Ollama or OpenAI
- **Playwright Integration**: Modern browser automation with auto-waiting
- **Page Object Model**: Clean, maintainable test architecture
- **TypeScript**: Full type safety and IntelliSense support

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- LLM Provider (Ollama or OpenAI API key)

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Configure LLM (copy and edit .env)
cp .env.example .env

# Run tests
npm test
```

## Configuration

Edit `.env` file:

### Option 1: Local Ollama (Recommended)
```env
LLM_PROVIDER=Local
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=qwen3-coder:480b-cloud
LLM_TEMPERATURE=0.1
LLM_MAX_TOKENS=1000
```

### Option 2: OpenAI
```env
LLM_PROVIDER=OpenAI
LLM_API_KEY=your-openai-api-key-here
LLM_BASE_URL=https://api.openai.com
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.1
LLM_MAX_TOKENS=1000
```

## Project Structure

```
├── src/
│   ├── pages/              # Page Object Models
│   ├── core/               # Self-healing framework
│   ├── llm/                # LLM integration
│   ├── models/             # TypeScript interfaces
│   └── config/             # Configuration loader
├── tests/                  # Playwright test files
├── .env.example            # Configuration template
└── playwright.config.ts    # Playwright configuration
```

## Usage

### Running Tests

```bash
npm test              # Run all tests
npm run test:ui       # Interactive UI mode
npm run test:headed   # See browser
npm run test:debug    # Debug mode
npm run test:report   # View report
```

### Writing Tests

```typescript
import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';

test('example test', async ({ page }) => {
  await page.goto('/');

  const homePage = new HomePage(page);
  await homePage.clickLogin();
});
```

## How Self-Healing Works

1. **Primary Strategy**: Tries original locator
2. **Alternative Strategies**: Tries stored alternatives
3. **AI Healing**: Sends page source to LLM for new locator suggestions

Example:
- Test tries `text=Login`
- Element not found (UI changed to "Sign In")
- LLM suggests `text=Sign In`, `role=link[name="Sign In"]`
- Test continues successfully

## Troubleshooting

### LLM Connection Issues
- **Ollama**: Ensure `ollama serve` is running
- **OpenAI**: Verify API key in `.env`

### Configuration Errors
Ensure `.env` has all required fields:
- `LLM_PROVIDER` (must be "Local" or "OpenAI")
- `LLM_BASE_URL` (must be valid URL)
- `LLM_MODEL`
- `LLM_TEMPERATURE`
- `LLM_MAX_TOKENS`

### AI Healing Not Working
- Check console for healing messages
- Verify page source contains target element
- Try different LLM model

## License

ISC
