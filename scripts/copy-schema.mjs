import fs from 'node:fs';
import path from 'node:path';

const source = path.resolve('src/db/schema.sql');
const target = path.resolve('dist/db/schema.sql');

if (!fs.existsSync(source)) {
  console.error(`ACC schema source missing: ${source}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.copyFileSync(source, target);
console.log(`ACC schema packaged: ${target}`);
