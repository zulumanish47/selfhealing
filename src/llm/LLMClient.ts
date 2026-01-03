export interface LLMClient {
  getCompletion(prompt: string): Promise<string>;
}
