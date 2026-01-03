using System.Text.Json;
using SeleniumSelfHealingTests.Utilities.Models;

namespace SeleniumSelfHealingTests.Utilities.LLMs;

public static class GetLocatorsFromLLMs
{
    public static async Task<LocatorSuggestions?> GetHealedLocator(LLMClient client, string pageSource, string locatorType, string originalLocator)
    {
        var prompt = $@"

                    The Web element with locatorType: {locatorType} and it locator {originalLocator} cannot be found the page.
                    Based on the current page source, suggest alternative locators that might work.
        
                       IMPORTANT: Return ONLY a valid JSON object with these keys: id, name, xpath, cssSelector, className, linkText.
                        - id
                        - name  
                        - xpath
                        - cssSelector
                        - className
                        - linkText

                        Format as a proper JSON with double quotes. Do not include any text before or after the JSON object.
                        Do not include explanations or comments, just return the JSON object.

                        Page source (truncated): {pageSource}
            ";

        var response = await client.GetCompletionAsync(prompt);
        
        return JsonSerializer.Deserialize<LocatorSuggestions>(response) ?? null;
    }
}