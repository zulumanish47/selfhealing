using OpenQA.Selenium;
using SeleniumSelfHealingTests.Utilities.LLMs;

namespace SeleniumSelfHealingTests.Utilities.Extensions;

public static class WebDriverExtensions
{
    public static async Task<IWebElement> AiFindElement(this IWebDriver webDriver, By by)
    {
        SelfHealingLocators selfHealingLocators = new SelfHealingLocators(webDriver, by);
        return await selfHealingLocators.FindElementAsync();
    }


    public static async Task Click(this Task<IWebElement> elementTask)
    {
        var element = await elementTask;
        element.Click();
    }
    
    public static async Task SendKeys(this Task<IWebElement> elementTask, string text)
    {
        var element = await elementTask;
        element.SendKeys(text);
    }
}