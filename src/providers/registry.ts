import { ModelProviderAdapter, ProviderHealth } from './base';
import { GeminiProviderAdapter } from './gemini';
import { OpenAIProviderAdapter } from './openai';
import { AnthropicProviderAdapter } from './anthropic';
import { XAIProviderAdapter } from './xai';
import { OLLMProviderAdapter } from './ollm';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private adapters: Map<string, ModelProviderAdapter> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  private registerDefaults(): void {
    // Google Gemini adapters
    this.register(new GeminiProviderAdapter('gemini-3.8-flash'));
    this.register(new GeminiProviderAdapter('gemini-3.1-pro-preview'));

    // OpenAI adapter
    this.register(new OpenAIProviderAdapter('gpt-4o'));

    // Anthropic Claude adapter
    this.register(new AnthropicProviderAdapter('claude-3-5-sonnet'));

    // xAI Grok adapter
    this.register(new XAIProviderAdapter('grok-2'));

    // OLLM local adapter
    this.register(new OLLMProviderAdapter('llama-3.3-70b-instruct'));
  }

  public register(adapter: ModelProviderAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  public get(id: string): ModelProviderAdapter | undefined {
    return this.adapters.get(id);
  }

  public getByProviderAndModel(provider: string, model: string): ModelProviderAdapter | undefined {
    for (const adapter of this.adapters.values()) {
      if (adapter.provider.toLowerCase() === provider.toLowerCase() && adapter.model.toLowerCase() === model.toLowerCase()) {
        return adapter;
      }
    }
    return undefined;
  }

  public getDefault(): ModelProviderAdapter {
    return this.adapters.get('google-gemini-3.8-flash') || this.adapters.values().next().value!;
  }

  public listAdapters(): ModelProviderAdapter[] {
    return Array.from(this.adapters.values());
  }

  public async getHealthSummary(): Promise<Record<string, ProviderHealth>> {
    const summary: Record<string, ProviderHealth> = {};
    for (const [id, adapter] of this.adapters.entries()) {
      summary[id] = await adapter.getHealth();
    }
    return summary;
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
