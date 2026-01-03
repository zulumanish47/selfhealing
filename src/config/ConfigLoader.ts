import dotenv from 'dotenv';
import { z } from 'zod';
import { LLMConfig } from '../models/LLMConfig';

dotenv.config();

const configSchema = z.object({
  LLM_PROVIDER: z.enum(['Local', 'OpenAI']),
  LLM_API_KEY: z.string().optional(),
  LLM_BASE_URL: z.string().url(),
  LLM_MODEL: z.string(),
  LLM_TEMPERATURE: z.string().transform((val) => parseFloat(val)),
  LLM_MAX_TOKENS: z.string().transform((val) => parseInt(val, 10)),
});

export function loadConfig(): LLMConfig {
  const parsed = configSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Configuration error: ${parsed.error.message}`);
  }

  const env = parsed.data;

  return {
    provider: env.LLM_PROVIDER,
    apiKey: env.LLM_API_KEY,
    baseUrl: env.LLM_BASE_URL,
    model: env.LLM_MODEL,
    temperature: env.LLM_TEMPERATURE,
    maxTokens: env.LLM_MAX_TOKENS,
  };
}
