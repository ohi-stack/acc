import { spawn } from 'node:child_process';

const port = Number(process.env.ACC_SMOKE_PORT || 3199);
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['dist/index.js'], {
  env: {
    ...process.env,
    NODE_ENV: 'test',
    PORT: String(port),
    ACC_VERSION: '1.2.0',
    POSTGRES_URL: 'postgres://postgres:postgres@127.0.0.1:5432/acc-smoke',
    DATABASE_SSL: 'false',
    ALLOW_CORS_ORIGIN: 'http://127.0.0.1',
    API_KEY: 'acc-smoke-key-not-for-production',
    ACC_SEED_BASELINE: 'false'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
child.stdout.on('data', chunk => { output += chunk.toString(); });
child.stderr.on('data', chunk => { output += chunk.toString(); });

async function waitFor(path, expectedStatus = 200) {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${base}${path}`);
      if (response.status === expectedStatus) return response.json();
      lastError = new Error(`${path} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw lastError || new Error(`timeout waiting for ${path}`);
}

try {
  const health = await waitFor('/health');
  if (health.service !== 'ACC' || health.version !== '1.2.0') throw new Error('health identity/version mismatch');

  const ready = await waitFor('/ready');
  if (ready.status !== 'ready') throw new Error(`runtime not ready: ${JSON.stringify(ready)}`);

  console.log(JSON.stringify({
    status: 'PASS',
    service: 'ACC',
    version: health.version,
    liveness: health.status,
    readiness: ready.status,
    productionClaim: false
  }, null, 2));
} catch (error) {
  console.error(output);
  console.error(`ACC smoke FAILED: ${error.message}`);
  process.exitCode = 1;
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => {
    const timer = setTimeout(resolve, 3000);
    child.once('exit', () => { clearTimeout(timer); resolve(); });
  });
}
