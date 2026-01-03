# SeleniumSelfHealingTests

A .NET 8 xUnit test project demonstrating self-healing Selenium locators powered by an LLM.

## Prerequisites
- .NET SDK 8.0
- Google Chrome (Selenium Manager will resolve ChromeDriver automatically)

## Project Structure
- `Pages/` – Page Objects (`HomePage`, `LoginPage`)
- `Utilities/Extensions/` – WebDriver async extensions (`AiFindElement`, `Click`, `SendKeys`)
- `Utilities/LLMs/` – LLM client and self-healing logic
- `Tests/` – xUnit tests (`EnhancedTests`)

## Quick Start
```powershell
Push-Location "c:\Users\DELL\Downloads\SeleniumSelfHealingTests\SeleniumSelfHealingTests"
dotnet restore
dotnet build SeleniumSelfHealingTests.sln -c Debug
dotnet test SeleniumSelfHealingTests.sln -c Debug
Pop-Location
```

## Configuration
Runtime config `appsetting.json` is copied to output at build time and should contain:
```json
{
  "Provider": "Local", // or "OpenAI"
  "ApiKey": "YOUR_API_KEY",
  "BaseUrl": "http://localhost:11434",
  "Model": "qwen3-coder:480b-cloud",
  "Temperature": 0.1,
  "MaxTokens": 1000
}
```
Note: Source `appsetting.json` is excluded from Git, and build outputs (`bin/`, `obj/`) are ignored to avoid committing secrets and heavy artifacts.

## Running Specific Tests
```powershell
# Run only EnhancedTests
Push-Location "c:\Users\DELL\Downloads\SeleniumSelfHealingTests\SeleniumSelfHealingTests"
dotnet test SeleniumSelfHealingTests.sln -c Debug --filter FullyQualifiedName~EnhancedTests
Pop-Location
```

## Troubleshooting
- If push protection blocks commits, ensure no secrets exist in history and that `bin/`/`obj/` are ignored.
- If ChromeDriver issues occur, update Chrome or ensure Selenium.WebDriver is current.

## License
This repository contains demo code for testing purposes.
