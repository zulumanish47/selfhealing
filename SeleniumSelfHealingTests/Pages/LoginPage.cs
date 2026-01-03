using OpenQA.Selenium;
using SeleniumSelfHealingTests.Utilities.Extensions;

namespace SeleniumSelfHealingTests.Pages;

public class LoginPage
{
    public LoginPage(IWebDriver driver)
    {
        _driver = driver;
    }
    
    private readonly IWebDriver _driver;
    private Task<IWebElement> UsernameField => _driver.AiFindElement(By.Id("UserName"));
    private Task<IWebElement> PasswordField => _driver.AiFindElement(By.Id("Password"));
    private Task<IWebElement> LoginButton => _driver.AiFindElement(By.CssSelector("input[type='submit']"));
    
    public async Task Login(string userName, string password)
    {
       await UsernameField.SendKeys(userName);
       await PasswordField.SendKeys(password);
       await LoginButton.Click();
    }
  
}
