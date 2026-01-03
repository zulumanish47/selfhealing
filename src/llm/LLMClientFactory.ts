import { LLMConfig } from '../models/LLMConfig';
import { LLMClient } from './LLMClient';
import { OllamaClient } from './OllamaClient';
import { OpenAIClient } from './OpenAIClient';

export function createLLMClient(config: LLMConfig): LLMClient {
  switch (config.provider) {
    case 'Local':
      return new OllamaClient(config);
    case 'OpenAI':
      return new OpenAIClient(config);
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}
