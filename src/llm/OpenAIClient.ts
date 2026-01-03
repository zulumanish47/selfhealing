import axios from 'axios';
import { LLMConfig } from '../models/LLMConfig';
import { LLMClient } from './LLMClient';

export class OpenAIClient implements LLMClient {
  constructor(private config: LLMConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  async getCompletion(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/v1/chat/completions`,
        {
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to get completion from OpenAI: ${error}`);
    }
  }
}
