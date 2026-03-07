const base = process.env.BASE_URL || 'http://127.0.0.1:4000';

const endpoints = ['/health', '/ready'];
for (const path of endpoints) {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) {
    console.error(`Smoke test failed for ${path}: ${res.status}`);
    process.exit(1);
  }
  const json = await res.json();
  console.log(path, json.status || json);
}
console.log('Smoke test passed.');
