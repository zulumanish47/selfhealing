using OpenQA.Selenium;
using SeleniumSelfHealingTests.Utilities.Extensions;

namespace SeleniumSelfHealingTests.Pages;

public class HomePage
{
    private readonly IWebDriver _driver;
    private Task<IWebElement> LoginLink => _driver.AiFindElement(By.LinkText("Login"));
    private Task<IWebElement> EmployeeDetailsLink => _driver.AiFindElement(By.LinkText("Employee Details"));
    private Task<IWebElement> ManageUsersLink => _driver.AiFindElement(By.LinkText("Manage Users"));
    private Task<IWebElement> LogoffLink => _driver.AiFindElement(By.LinkText("Log off"));
    
    public HomePage(IWebDriver driver)
    {
        _driver = driver;
    }

    // One-step click operations using the element properties and new extension methods
    public async Task ClickLogin() => await LoginLink.Click();
    
    public async Task ClickEmployeeDetails() => await EmployeeDetailsLink.Click();
    
    public async Task ClickManageUsers() => await ManageUsersLink.Click();
    
    public async Task ClickLogoff() => await LogoffLink.Click();
}
