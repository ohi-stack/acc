import test from 'node:test';
import assert from 'node:assert/strict';
import { permittedOperation, providerPresentation, verifiedDeployment, projectIndex, validateMutation } from '../app/lib/contracts.mjs';

test('unknown providers fail closed and Dot is never executable', () => {
  assert.equal(providerPresentation('unknown', { executable: true }).executable, false);
  assert.equal(providerPresentation('openai-dot', { executable: true, health: 'healthy' }).executable, false);
  assert.equal(providerPresentation('openai-dot').maturity, 'Reserved');
  assert.equal(providerPresentation('acc-runner').health, 'Unknown');
});
test('generic status mutation cannot satisfy approval', () => {
  assert.equal(permittedOperation('POST', ['work-orders','123','status']), false);
  assert.equal(permittedOperation('POST', ['approvals','123','decide']), true);
  assert.equal(validateMutation('work-orders', {projectId:'p',objective:'o',provider:'human',approvalSatisfied:true}), false);
  assert.equal(validateMutation('work-orders', {projectId:'p',objective:'o',provider:'unknown'}), false);
});
test('a merged PR or deployment identifier is insufficient verification', () => {
  assert.equal(verifiedDeployment({ status:'MERGED', deployment_id:'d' }), false);
  assert.equal(verifiedDeployment({ status:'DEPLOYED' }), false);
  assert.equal(verifiedDeployment({verification: {status:'VERIFIED',evidence:'https://evidence.test/1'}}), true);
});
test('project index derives only recorded projects, without seed production records', () => {
  assert.deepEqual(projectIndex([],[]),[]);
  assert.equal(projectIndex([{project_id:'p'}],[{project_id:'p'}]).length,1);
});
test('API paths reject traversal and unsupported mutation', () => {
  assert.equal(permittedOperation('GET',['..','health']), false);
  assert.equal(permittedOperation('GET',['work-orders','%2f']),false);
  assert.equal(permittedOperation('POST',['providers','invoke']),false);
});
test('Responsibility intake cannot activate ongoing work', () => {
  assert.equal(validateMutation('responsibilities',{projectId:'p',name:'n',ownerId:'o',provider:'human',status:'ACTIVE'}),false);
  assert.equal(validateMutation('responsibilities',{projectId:'p',name:'n',ownerId:'o',provider:'human',status:'DRAFT'}),true);
});
test('canonical verification is correlated to its deployment and latest decision', () => {
  const dep={id:'d',deployed_sha:'sha',verification_evidence:{note:'PR merged'}};
  assert.equal(verifiedDeployment(dep,[]),false);
  assert.equal(verifiedDeployment(dep,[{entity_type:'deployment',entity_id:'other',status:'VERIFIED',evidence:{proof:'p'},verified_at:'2026-09-30'}]),false);
  assert.equal(verifiedDeployment(dep,[{entity_type:'deployment',entity_id:'d',status:'VERIFIED',evidence:{proof:'p'},verified_at:'2026-09-30'}]),true);
  assert.equal(verifiedDeployment(dep,[{entity_type:'deployment',entity_id:'d',status:'VERIFIED',evidence:{proof:'p'},verified_at:'2026-09-29'},{entity_type:'deployment',entity_id:'d',status:'FAILED',evidence:{proof:'failure'},verified_at:'2026-09-30'}]),false);
});
test('attention stays loading until every source resolves',async()=>{
  const {attentionState}=await import('../app/lib/contracts.mjs');
  assert.equal(attentionState({'work-orders':{loading:false}}).loading,true);
  const data=Object.fromEntries(['approvals','work-orders','executions','connections','deployments','verification'].map(k=>[k,{loading:false,error:null}]));
  assert.equal(attentionState(data).loading,false);
  data.approvals.error='unauthorized';assert.ok(attentionState(data).error);
});
test('health summary consumes canonical fields without inventing an aggregate',async()=>{
  const {healthSummary}=await import('../app/lib/contracts.mjs');
  assert.deepEqual(healthSummary(null),{system:'Unknown',providers:'Unknown'});
  assert.deepEqual(healthSummary({overallStatus:'Degraded',timestamp:'2026-09-30',subsystems:[{category:'provider',status:'Healthy'},{category:'provider',status:'Offline'}]}),{system:'Degraded',providers:'1/2 healthy'});
});
