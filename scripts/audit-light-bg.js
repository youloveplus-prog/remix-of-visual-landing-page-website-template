import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const root = 'src';

const patterns = [
  /\bbg-white\b/,
  /\bbg-gray-50\b/,
  /\bbg-gray-100\b/,
  /\bbg-slate-50\b/,
  /\bbg-slate-100\b/,
  /\bbg-\[#f[0-9a-fA-F]{2,}\]/,
  /\bbg-\[#[eE][0-9a-fA-F]{2,}\]/,
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, files);
    else if (/\.(tsx|jsx|ts|js|css|html)$/.test(entry)) files.push(full);
  }
  return files;
}

let found = 0;
for (const file of walk(root)) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const rel = relative('.', file);
  const matches = [];
  lines.forEach((line, idx) => {
    for (const p of patterns) {
      const m = line.match(p);
      if (m) matches.push(`  Line ${idx + 1}: ${line.trim()}`);
    }
  });
  if (matches.length) {
    console.log(rel);
    matches.forEach(m => console.log(m));
    console.log();
    found += matches.length;
  }
}

console.log(`Audit complete. ${found} match(es) found.`);
