import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createResponsibilitySchema,
  createWorkOrderSchema,
  providerCatalog,
  workOrderStatusSchema
} from './delegation.routes';

test('accepts a planned work order for a known non-executable provider', () => {
  const parsed = createWorkOrderSchema.parse({
    projectId: 'allatyme',
    objective: 'Prepare a code change for review',
    provider: 'openai-codex',
    requestedBy: 'onegodian_admin',
    requiresHumanApproval: true
  });
  assert.equal(parsed.provider, 'openai-codex');
});

test('rejects an unknown provider at the API boundary', () => {
  assert.throws(() => createWorkOrderSchema.parse({
    projectId: 'allatyme',
    objective: 'Do work',
    provider: 'unknown-runtime',
    requestedBy: 'onegodian_admin'
  }));
});

test('responsibilities require a known provider', () => {
  const parsed = createResponsibilitySchema.parse({
    projectId: 'algonquian-real-estate',
    name: 'Property acquisition follow-up',
    provider: 'human',
    ownerId: 'onegodian_admin'
  });
  assert.equal(parsed.provider, 'human');
});

test('provider catalog exposes OpenAI Dot as reserved and non-executable', () => {
  const dot = providerCatalog().find(provider => provider.id === 'openai-dot');
  assert.ok(dot);
  assert.equal(dot.executable, false);
  assert.equal(dot.maturity, 'reserved');
});

test('work order status API accepts only canonical states', () => {
  assert.equal(workOrderStatusSchema.parse({ status: 'AWAITING_APPROVAL' }).status, 'AWAITING_APPROVAL');
  assert.throws(() => workOrderStatusSchema.parse({ status: 'DONE' }));
});

test('status endpoint cannot self-assert human approval', () => {
  assert.throws(() => workOrderStatusSchema.parse({
    status: 'COMPLETED',
    approvalSatisfied: true
  }));
});
