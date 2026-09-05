export interface ModelInvocationParams {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  structuredSchema?: any;
}

export interface ModelUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ModelProvenance {
  provider: string;
  model: string;
  adapterVersion: string;
  timestamp: string;
  requestId: string;
  latencyMs: number;
}

export interface ModelInvocationResult {
  content: string;
  usage: ModelUsage;
  latencyMs: number;
  costEstimateUsd?: number;
  requestId: string;
  provenance: ModelProvenance;
}

export interface ProviderHealth {
  status: 'Healthy' | 'Degraded' | 'Offline' | 'Authorization Required' | 'Unknown';
  latencyMs: number;
  authenticated: boolean;
  error?: string;
}

export interface ModelProviderAdapter {
  readonly id: string;
  readonly provider: string;
  readonly model: string;
  readonly capabilities: string[];
  readonly toolSupport: boolean;
  readonly structuredOutputSupport: boolean;

  getHealth(): Promise<ProviderHealth>;
  invoke(params: ModelInvocationParams): Promise<ModelInvocationResult>;
}
