// Covers S1 (T4): seed dry-run documents match the Studio schemas. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createJiti } from 'jiti';

const id = (x) => x;
const jiti = createJiti(import.meta.url, { virtualModules: { sanity: { defineType: id, defineField: id, defineArrayMember: id } }, alias: {} });
const docs = JSON.parse(execFileSync(process.execPath, ['scripts/seed.mjs', '--dry-run'], { encoding: 'utf8' }));

test('gallery and home counts', () => {
  const ps = docs.filter((d) => d._type === 'postre');
  assert.equal(ps.filter((p) => p.enGaleria !== false).length, 14);
  assert.equal(ps.filter((p) => p.destacado).length, 8);
});

test('every seeded field exists in the schema and required fields are filled', async () => {
  const { documentTypes } = await jiti.import('../src/sanity/schemas/documents.ts');
  const { objectTypes } = await jiti.import('../src/sanity/schemas/objects.ts');
  const named = Object.fromEntries([...documentTypes, ...objectTypes].map((t) => [t.name, t]));
  const errs = [];
  const isReq = (v) => {
    if (!v) return false;
    let req = false, warn = false;
    const p = new Proxy(() => {}, { get: (_, k) => () => { if (k === 'required') req = true; if (k === 'warning') warn = true; return p; } });
    v(p);
    return req && !warn;
  };
  const walk = (val, def, path) => {
    if (named[def.type] && def.type !== 'image') def = { ...named[def.type], ...def, fields: def.fields || named[def.type].fields, type: named[def.type].type };
    if (isReq(def.validation) && (val == null || val === '' || (Array.isArray(val) && !val.length))) errs.push(`required ${path}`);
    if (val == null) return;
    if (def.type === 'array') {
      return val.forEach((it, i) => {
        const m = def.of.length === 1 ? def.of[0] : def.of.find((o) => (o.name || o.type) === it._type);
        if (!m) errs.push(`member ${path}[${i}]`); else walk(it, m, `${path}[${i}]`);
      });
    }
    if (def.fields) {
      for (const k of Object.keys(val)) if (!k.startsWith('_') && !def.fields.some((f) => f.name === k)) errs.push(`unknown ${path}.${k}`);
      for (const f of def.fields) walk(val[f.name], f, `${path}.${f.name}`);
    }
  };
  for (const d of docs) named[d._type] ? walk(d, named[d._type], d._id) : errs.push(`no schema ${d._type}`);
  assert.deepEqual(errs, []);
});
