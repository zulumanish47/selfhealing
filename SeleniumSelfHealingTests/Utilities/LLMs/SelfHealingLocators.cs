using OpenQA.Selenium;

namespace SeleniumSelfHealingTests.Utilities.LLMs;

public class SelfHealingLocators
{
    private readonly IWebDriver _driver;
    private By _currentStrategy;
    private readonly Dictionary<string, By> _locatorStrategies;

    public SelfHealingLocators(IWebDriver driver, By primaryLocator)
    {
        _driver = driver;
        _currentStrategy = primaryLocator;
        _locatorStrategies = new Dictionary<string, By> { { "primary", primaryLocator } };
    }

    public async Task<IWebElement> FindElementAsync(int retryAttempts = 2)
    {
        //Step 1: Try finding the element using Current Strategy
        var element = TryFindWithCurrentStrategy();
        if (element != null) return element;
        
        //Step 2 - Find the alternative Strategy 
        element = TryAlternativeStrategies();
        if (element != null) return element;
        
        //Step 3 - AI Based AutoHealing approach
        if (retryAttempts > 0)
        {
            await HealUsingAI();
            return await FindElementAsync(retryAttempts -1);
        }

        throw new NoSuchElementException($"Failed to locate the element after all healing attempts: {retryAttempts}");
    }


    private IWebElement? TryFindWithCurrentStrategy()
    {
        try
        {
            return _driver.FindElement(_currentStrategy);
        }
        catch (NoSuchElementException)
        {
            return null;
        }
    }

    private IWebElement? TryAlternativeStrategies()
    {
        if (_locatorStrategies.Count <= 1) return null;

        foreach (var (strategyName, strategy) in _locatorStrategies)
        {
            if(strategy.Equals(_currentStrategy)) continue;

            try
            {
                var element = _driver.FindElement(strategy);
                _currentStrategy = strategy; //Update to successful strategy
                return element;
            }
            catch (NoSuchElementException)
            {
                
            }
        }

        return null;
    }

    private async Task HealUsingAI()
    {
        try
        {
            var strategyString = _currentStrategy.ToString();
            int separatorIndex = strategyString.IndexOf(":");

            string locatorType = strategyString.Substring(0, separatorIndex);
            string locatorValue = strategyString.Substring(separatorIndex + 1).Trim();

            var pageSource = _driver.PageSource;

            LLMClient client = new LLMClient();
            var suggestedLocators =
                await GetLocatorsFromLLMs.GetHealedLocator(client, pageSource, locatorType, locatorValue);
            if (suggestedLocators == null)
            {
                Console.WriteLine("AI healing returned no suggestions");
                return;
            }

            int addedCount = 0;
            addedCount += TryCreateLocatorStrategy("id", suggestedLocators.id);
            addedCount += TryCreateLocatorStrategy("xpath", suggestedLocators.xpath);
            addedCount += TryCreateLocatorStrategy("css", suggestedLocators.cssSelector);
            addedCount += TryCreateLocatorStrategy("name", suggestedLocators.name);
            addedCount += TryCreateLocatorStrategy("class", suggestedLocators.className);
            addedCount += TryCreateLocatorStrategy("linkText", suggestedLocators.linkText);

            Console.WriteLine(
                $"AI healing completed with total added locators are {addedCount} as alternative locators");
        }
        catch (Exception)
        {
            Console.WriteLine("AI healing failed");
        }
    }


    private int TryCreateLocatorStrategy(string locatorType, string locatorValue)
    {
        if (string.IsNullOrWhiteSpace(locatorValue))
            return 0;

        try
        {
            By by;
            switch (locatorType.ToLowerInvariant())
            {
                case "id":
                    by = By.Id(locatorValue);
                    break;
                case "name":
                    by = By.Name(locatorValue);
                    break;
                case "classname":
                case "class":
                    by = By.ClassName(locatorValue);
                    break;
                case "tagname":
                case "tag":
                    by = By.TagName(locatorValue);
                    break;
                case "linktext":
                    by = By.LinkText(locatorValue);
                    break;
                case "partiallinktext":
                    by = By.PartialLinkText(locatorValue);
                    break;
                case "cssselector":
                case "css":
                    by = By.CssSelector(locatorValue);
                    break;
                case "xpath":
                    by = By.XPath(locatorValue);
                    break;
                default:
                    return 0; // Unsupported locator type
            }
            
            _locatorStrategies[locatorType] = by;
            return 1;
        }
        catch
        {
            // Ignore invalid locators
            return 0;
        }
    }
}