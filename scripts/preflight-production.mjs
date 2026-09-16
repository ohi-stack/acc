import fs from 'node:fs';

const failures = [];
const requireValue = (name) => {
  const value = String(process.env[name] || '').trim();
  if (!value) failures.push(`${name} is required`);
  return value;
};

const EXPECTED_ACC_VERSION = '1.3.0';

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor < 20 || nodeMajor >= 23) failures.push(`Node ${process.version} is outside supported range >=20 <23`);

if (process.env.NODE_ENV !== 'production') failures.push('NODE_ENV must be production');
const version = requireValue('ACC_VERSION');
if (version && version !== EXPECTED_ACC_VERSION) failures.push(`ACC_VERSION must be ${EXPECTED_ACC_VERSION}; received ${version}`);

const postgres = requireValue('POSTGRES_URL');
if (postgres) {
  if (!/^postgres(?:ql)?:\/\//i.test(postgres)) failures.push('POSTGRES_URL must be PostgreSQL');
  if (/(?:localhost|127\.0\.0\.1)/i.test(postgres)) failures.push('POSTGRES_URL must not point to a local database in production');
}

const apiKey = requireValue('API_KEY');
if (apiKey && apiKey.length < 24) failures.push('API_KEY must contain at least 24 characters');
requireValue('ACC_OPERATOR_ID');
const operatorRole = requireValue('ACC_OPERATOR_ROLE');
if (operatorRole && !['super_admin', 'domain_lead', 'acc_operator', 'observer'].includes(operatorRole)) {
  failures.push(`ACC_OPERATOR_ROLE is invalid: ${operatorRole}`);
}

const cors = requireValue('ALLOW_CORS_ORIGIN');
if (cors === '*') failures.push('ALLOW_CORS_ORIGIN cannot be wildcard in production');
if (String(process.env.ACC_SEED_BASELINE || 'false').toLowerCase() === 'true') failures.push('ACC_SEED_BASELINE must be false in production');

for (const artifact of ['dist/index.js', 'dist/db/schema.sql', 'public/bundle.js', 'public/index.html']) {
  if (!fs.existsSync(artifact)) failures.push(`required build artifact missing: ${artifact}`);
}

if (failures.length) {
  console.error('ACC production preflight FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'PASS',
  service: 'ACC',
  version,
  node: process.version,
  productionDatabase: 'configured-remote-postgresql',
  apiAuthenticationRequired: true,
  authorityIdentityServerBound: true,
  corsRestricted: true,
  baselineDemoSeedEnabled: false,
  schemaPackaged: true,
  artifactsVerified: true,
  productionClaim: false,
  note: 'Environment/build preflight passed. Deployment still requires live authentication, /ready, state/restart, and exact deployed-SHA evidence.'
}, null, 2));
