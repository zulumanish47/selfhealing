using System.Text;
using System.Text.Json;
using SeleniumSelfHealingTests.Utilities.Models;

namespace SeleniumSelfHealingTests.Utilities.LLMs;

public class LLMClient
{
    private readonly HttpClient _httpClient;

    private readonly LLMConfig _llmConfig;

    public LLMClient()
    {
        _httpClient = new HttpClient();
        _llmConfig = ReadJsonFile();
    }

    public async Task<string> CallLocalLLMAsync(string prompt)
    {
        var requestBody = new
        {
            model = _llmConfig.Model,
            prompt = prompt,
            stream = false,
            options = new { temperature = _llmConfig.Temperature }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_llmConfig.BaseUrl}/api/generate", content);

        response.EnsureSuccessStatusCode();

        var responseText = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseText);

        return jsonResponse.GetProperty("response").GetString() ?? string.Empty;

    }

    public async Task<string> CallOpenAIAsync(string prompt)
    {
        var requestBody = new
        {
            model = _llmConfig.Model,
            messages = new[] { new { role = "user", content = prompt } },
            temperature = _llmConfig.Temperature,
            max_tokens = _llmConfig.MaxTokens
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        //Add the authorization header with the openai API Key
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_llmConfig.ApiKey}");

        var response = await _httpClient.PostAsync($"{_llmConfig.BaseUrl}/v1/chat/completions", content);

        response.EnsureSuccessStatusCode();

        var responseText = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseText);

        return jsonResponse.GetProperty("choices")
            .EnumerateArray()
            .First()
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? string.Empty;

    }

    public async Task<string> GetCompletionAsync(string prompt)
    {
        return _llmConfig.Provider.ToLower() switch
        {
            "openai" => await CallOpenAIAsync(prompt),
            "local" => await CallLocalLLMAsync(prompt),
            _ => throw new NotSupportedException($"Provider {_llmConfig.Provider} is not supported")
        };
    }


    public LLMConfig ReadJsonFile()
    {
        var jsonFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "appsetting.json");
        string jsonData = File.ReadAllText(jsonFilePath);
        return JsonSerializer.Deserialize<LLMConfig>(jsonData)!;
    }
}