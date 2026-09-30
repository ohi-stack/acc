import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertDispatchableProvider,
  canTransitionWorkOrder,
  normalizeWorkOrderInput
} from './DelegationService';

test('blocks a reserved provider from dispatch', () => {
  assert.throws(
    () => assertDispatchableProvider('openai-dot'),
    /not executable/i
  );
});

test('allows the canonical ACC runner provider to dispatch', () => {
  assert.doesNotThrow(() => assertDispatchableProvider('acc-runner'));
});

test('rejects an unknown provider rather than silently routing it', () => {
  assert.throws(
    () => assertDispatchableProvider('unknown-runtime'),
    /unsupported execution provider/i
  );
});

test('normalizes a new work order with a planned status and approval metadata', () => {
  const workOrder = normalizeWorkOrderInput({
    projectId: 'allatyme',
    objective: 'Prepare the next verified frontend deployment',
    provider: 'openai-codex',
    requestedBy: 'onegodian_admin',
    riskLevel: 'HIGH',
    requiresHumanApproval: true
  });

  assert.equal(workOrder.status, 'PLANNED');
  assert.equal(workOrder.provider, 'openai-codex');
  assert.equal(workOrder.requiresHumanApproval, true);
  assert.equal(workOrder.riskLevel, 'HIGH');
});

test('preserves the human gate for privileged work before completion', () => {
  assert.equal(canTransitionWorkOrder('RUNNING', 'COMPLETED', true, false), false);
  assert.equal(canTransitionWorkOrder('RUNNING', 'AWAITING_APPROVAL', true, false), true);
  assert.equal(canTransitionWorkOrder('AWAITING_APPROVAL', 'COMPLETED', true, true), true);
});
