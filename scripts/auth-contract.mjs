process.env.NODE_ENV = 'production';
process.env.ACC_VERSION = '1.2.0';
process.env.POSTGRES_URL = 'postgresql://acc:placeholder@db.example.invalid:5432/acc';
process.env.DATABASE_SSL = 'true';
process.env.ALLOW_CORS_ORIGIN = 'https://acc.onegodian.com';
process.env.API_KEY = 'acc-auth-contract-key-000000000001';
process.env.ACC_OPERATOR_ID = 'operator-contract-test';
process.env.ACC_OPERATOR_ROLE = 'acc_operator';
process.env.ACC_SEED_BASELINE = 'false';

const { apiAuth } = await import('../dist/middleware/api-auth.js');

function invoke(headers) {
  return new Promise((resolve, reject) => {
    const req = { headers: { ...headers } };
    const result = { statusCode: null, body: null, nextCalled: false, req };
    const res = {
      status(code) { result.statusCode = code; return this; },
      json(body) { result.body = body; resolve(result); return this; }
    };
    const next = () => { result.nextCalled = true; resolve(result); };
    try { apiAuth(req, res, next); } catch (error) { reject(error); }
  });
}

const rejected = await invoke({ 'x-acc-key': 'wrong-key', 'x-acc-role': 'super_admin', 'x-acc-actor': 'attacker' });
if (rejected.statusCode !== 401 || rejected.nextCalled) throw new Error('invalid key was not rejected');

const accepted = await invoke({
  authorization: `Bearer ${process.env.API_KEY}`,
  'x-acc-role': 'super_admin',
  'x-acc-actor': 'caller-controlled'
});
if (!accepted.nextCalled) throw new Error('valid production API key was rejected');
if (accepted.req.headers['x-acc-role'] !== 'acc_operator') throw new Error('caller role was not overwritten by server authority');
if (accepted.req.headers['x-acc-actor'] !== 'operator-contract-test') throw new Error('caller identity was not overwritten by server authority');

console.log(JSON.stringify({
  status: 'PASS',
  unauthorizedRejected: true,
  callerRoleElevationBlocked: true,
  serverBoundAuthority: true,
  productionClaim: false
}, null, 2));
