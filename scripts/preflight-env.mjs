import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const required = ['TENANT_ID', 'RAISUITE_API_BASE', 'RAISUITE_API_KEY'];

let missing = [];
for (const v of required) {
  if (!process.env[v] || process.env[v].trim() === '') {
    missing.push(v);
  }
}

if (missing.length) {
  console.error('[preflight] Missing required environment variables:', missing.join(', '));
  process.exit(1);
} else {
  console.log('[preflight] Environment OK.');
}

try {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const examplePath = path.join(__dirname, '..', 'env.example');
  const example = readFileSync(examplePath, 'utf-8');
  for (const v of required) {
    if (!example.includes(v)) {
      console.warn(`[preflight] Variable ${v} not found in env.example.`);
    }
  }
} catch {}