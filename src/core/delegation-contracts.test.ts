import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXECUTION_PROVIDERS,
  getExecutionProviderDefinition,
  isExecutionProvider
} from './delegation-contracts';

test('accepts the canonical execution provider identifiers', () => {
  for (const provider of [
    'openai-agents',
    'openai-dot',
    'openai-codex',
    'chatgpt-work',
    'acc-runner',
    'omos',
    'external-mcp',
    'human'
  ]) {
    assert.equal(isExecutionProvider(provider), true, provider);
  }
});

test('rejects an unknown execution provider identifier', () => {
  assert.equal(isExecutionProvider('mystery-provider'), false);
});

test('keeps OpenAI Dot as a reserved non-executable provider contract', () => {
  const dot = getExecutionProviderDefinition('openai-dot');
  assert.equal(dot.id, 'openai-dot');
  assert.equal(dot.maturity, 'reserved');
  assert.equal(dot.executable, false);
});

test('every provider definition declares maturity and execution state', () => {
  assert.ok(EXECUTION_PROVIDERS.length >= 8);
  for (const provider of EXECUTION_PROVIDERS) {
    assert.ok(provider.id.length > 0);
    assert.ok(['available', 'connected', 'external', 'reserved'].includes(provider.maturity));
    assert.equal(typeof provider.executable, 'boolean');
  }
});
