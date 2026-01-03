namespace SeleniumSelfHealingTests.Utilities.Models;

public class LLMConfig
{
    public string Provider { get; set; } = "Local"; //OpenAI or Local
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "http://localhost:11434";
    public string Model { get; set; } = "gpt-4o-mini"; // Model name
    public double Temperature { get; set; } = 0.1;
    public int MaxTokens { get; set; } = 1000;
}