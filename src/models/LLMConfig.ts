export interface LLMConfig {
  provider: 'Local' | 'OpenAI';
  apiKey?: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}
