
using System.Text.Json;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using SeleniumSelfHealingTests.Pages;
using SeleniumSelfHealingTests.Utilities;
using SeleniumSelfHealingTests.Utilities.LLMs;

namespace SeleniumSelfHealingTests.Tests;

public class EnhancedTests
{
    [Fact]
    public async Task TraditionalTest()
    {
        // Setup driver with some basic options
        var options = new ChromeOptions();
        options.AddArgument("--start-maximized");
        
        IWebDriver driver = new ChromeDriver(options);
        try
        {
            driver.Navigate().GoToUrl("http://eaapp.somee.com");
            
            // Use enhanced page objects with self-healing elements
            var homePage = new HomePage(driver);
            await homePage.ClickLogin();
            
            var loginPage = new LoginPage(driver);
            await loginPage.Login("admin", "password");
            
            //Click Employee Details
            await homePage.ClickEmployeeDetails();

            await homePage.ClickManageUsers();

            await homePage.ClickLogoff();

        }
        finally
        {
            // Clean up
            driver.Quit();
        }
    }

    [Fact]
    public async Task CallingLLMClient()
    {

        // Setup driver with some basic options
        var options = new ChromeOptions();
        options.AddArgument("--start-maximized");
        
        IWebDriver driver = new ChromeDriver(options);
        driver.Navigate().GoToUrl("http://eaapp.somee.com");

        var element = By.LinkText("Login");
        SelfHealingLocators selfHealingLocators = new SelfHealingLocators(driver, element);
        var aiElement = await selfHealingLocators.FindElementAsync();
        aiElement.Click();
    }
}
