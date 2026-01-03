import axios from 'axios';
import { LLMConfig } from '../models/LLMConfig';
import { LLMClient } from './LLMClient';

export class OllamaClient implements LLMClient {
  constructor(private config: LLMConfig) {}

  async getCompletion(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/api/generate`,
        {
          model: this.config.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: this.config.temperature,
          },
        }
      );

      return response.data.response || '';
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error(`Failed to get completion from Ollama: ${error}`);
    }
  }
}
