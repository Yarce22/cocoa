// Covers item 5 / S5: the write token never reaches the build output or site code. Run after `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

test('build output contains no write token or token-like string', { skip: !existsSync('dist') && 'run astro build first' }, () => {
  for (const f of walk('dist').filter((f) => /\.(html|js|mjs|json|css)$/.test(f))) {
    const s = readFileSync(f, 'utf8');
    assert.ok(!s.includes('SANITY_WRITE_TOKEN'), f);
    assert.ok(!/\bsk[A-Za-z0-9]{40,}/.test(s), f);
  }
});

test('only scripts/seed.mjs reads SANITY_WRITE_TOKEN', () => {
  for (const f of walk('src')) assert.ok(!readFileSync(f, 'utf8').includes('SANITY_WRITE_TOKEN'), f);
});
