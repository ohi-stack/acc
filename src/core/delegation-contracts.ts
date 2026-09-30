export type ProviderMaturity = 'available' | 'connected' | 'external' | 'reserved';

export interface ExecutionProviderDefinition {
  id: string;
  label: string;
  category: 'internal' | 'openai' | 'external' | 'human';
  maturity: ProviderMaturity;
  executable: boolean;
  requiresConnection: boolean;
  notes: string;
}

export const EXECUTION_PROVIDERS = [
  {
    id: 'acc-runner',
    label: 'ACC Runner',
    category: 'internal',
    maturity: 'connected',
    executable: true,
    requiresConnection: false,
    notes: 'Canonical governed ACC execution runtime.'
  },
  {
    id: 'omos',
    label: 'OMOS',
    category: 'internal',
    maturity: 'external',
    executable: false,
    requiresConnection: true,
    notes: 'Reasoning and operating-system integration; privileged execution still routes through ACC authorization.'
  },
  {
    id: 'openai-agents',
    label: 'OpenAI Agents',
    category: 'openai',
    maturity: 'reserved',
    executable: false,
    requiresConnection: true,
    notes: 'Provider contract reserved until an ACC adapter is configured and verified.'
  },
  {
    id: 'openai-dot',
    label: 'OpenAI Dot',
    category: 'openai',
    maturity: 'reserved',
    executable: false,
    requiresConnection: true,
    notes: 'Reserved compatibility contract only. No executable ACC integration is represented by this record.'
  },
  {
    id: 'openai-codex',
    label: 'OpenAI Codex',
    category: 'openai',
    maturity: 'external',
    executable: false,
    requiresConnection: true,
    notes: 'Software-engineering execution target once an approved ACC integration is configured.'
  },
  {
    id: 'chatgpt-work',
    label: 'ChatGPT Work',
    category: 'openai',
    maturity: 'external',
    executable: false,
    requiresConnection: true,
    notes: 'External work surface; not treated as an ACC runtime until a supported integration exists.'
  },
  {
    id: 'external-mcp',
    label: 'External MCP',
    category: 'external',
    maturity: 'external',
    executable: false,
    requiresConnection: true,
    notes: 'Generic external tool/provider boundary requiring an explicit registered connection.'
  },
  {
    id: 'human',
    label: 'Human Operator',
    category: 'human',
    maturity: 'available',
    executable: true,
    requiresConnection: false,
    notes: 'Human-assigned work and decision responsibility.'
  }
] as const satisfies readonly ExecutionProviderDefinition[];

export type ExecutionProvider = (typeof EXECUTION_PROVIDERS)[number]['id'];

export function isExecutionProvider(value: string): value is ExecutionProvider {
  return EXECUTION_PROVIDERS.some(provider => provider.id === value);
}

export function getExecutionProviderDefinition(value: string): (typeof EXECUTION_PROVIDERS)[number] {
  const provider = EXECUTION_PROVIDERS.find(candidate => candidate.id === value);
  if (!provider) {
    throw new Error(`Unsupported execution provider: ${value}`);
  }
  return provider;
}

export type WorkOrderStatus =
  | 'PLANNED'
  | 'READY'
  | 'BLOCKED'
  | 'QUEUED'
  | 'RUNNING'
  | 'AWAITING_APPROVAL'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type ResponsibilityStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'BLOCKED' | 'ARCHIVED';
