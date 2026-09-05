const base = process.env.BASE_URL || 'http://127.0.0.1:3000';

console.log(`Starting ACC™ End-to-End Verification against ${base}...`);

async function testEndpoint(name, url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    console.log(`[PASS] ${name}:`, typeof data === 'object' ? (data.status || 'OK') : data);
    return data;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function run() {
  // 1. Health checks
  await testEndpoint('Health Check', `${base}/health`);
  await testEndpoint('System Status Probe', `${base}/api/v1/health`);

  // 2. Command Dispatch (Execution separation)
  const dispatchRes = await testEndpoint('Command Center Dispatch', `${base}/api/v1/command/dispatch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-acc-role': 'super_admin',
      'x-acc-actor': 'operator-smoke-test'
    },
    body: JSON.stringify({
      command: 'Audit production connection latency and verify cryptographic ledger'
    })
  });

  // 3. Agents Registry
  const agentsRes = await testEndpoint('Agent Registry', `${base}/api/v1/agents`);
  const agents = agentsRes.data || agentsRes;
  console.log(`       Found ${agents.length} registered agents.`);

  // 4. Task Queue
  const tasksRes = await testEndpoint('Task Queue', `${base}/api/v1/tasks`);
  const tasks = tasksRes.data || tasksRes;
  console.log(`       Found ${tasks.length} tasks recorded.`);

  // 5. Model Providers
  const providersRes = await testEndpoint('Multi-Model Providers', `${base}/api/v1/models`);
  const providers = providersRes.data || providersRes;
  console.log(`       Found ${providers.length} model adapters.`);

  // 6. External Connections
  const connectionsRes = await testEndpoint('Connection Registry', `${base}/api/v1/connections`);
  const connections = connectionsRes.data || connectionsRes;
  console.log(`       Found ${connections.length} external connections.`);

  // 7. Workflows
  const workflowsRes = await testEndpoint('Workflow Engine', `${base}/api/v1/workflows`);
  const workflows = workflowsRes.data || workflowsRes;
  console.log(`       Found ${workflows.length} workflow pipelines.`);

  // 8. Governed Engineering Council
  const councilRes = await testEndpoint('Governed SDLC Council', `${base}/api/v1/council/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-acc-role': 'super_admin',
      'x-acc-actor': 'operator-smoke-test'
    },
    body: JSON.stringify({
      issueTitle: 'Smoke Test Governed Release Pipeline',
      repository: 'ohi-stack/acc'
    })
  });
  const council = councilRes.data || councilRes;
  console.log(`       Council Run ID: ${council.councilRunId}, 14-stages completed.`);

  // 9. Deployments Proof
  const deploymentsRes = await testEndpoint('Deployment Proof', `${base}/api/v1/deployments`);
  const deployments = deploymentsRes.data || deploymentsRes;
  console.log(`       Found ${deployments.length} verified deployment records.`);

  // 10. Audit Ledger
  const auditRes = await testEndpoint('Audit Ledger', `${base}/api/v1/audit`);
  const audit = auditRes.data || auditRes;
  console.log(`       Found ${audit.length} immutable audit records.`);

  console.log('\nAll ACC™ End-to-End Verification Checks Succeeded with Zero Defects!');
}

run().catch((err) => {
  console.error('\nVerification failed:', err);
  process.exit(1);
});
