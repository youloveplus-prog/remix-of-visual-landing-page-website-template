import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const root = 'src';

const patterns = [
  { regex: /\bbg-white\b(?!\/)/, name: 'bg-white', riskBase: 'CRITICAL' },
  { regex: /\bbg-gray-50\b(?!\/)/, name: 'bg-gray-50', riskBase: 'HIGH' },
  { regex: /\bbg-gray-100\b(?!\/)/, name: 'bg-gray-100', riskBase: 'HIGH' },
  { regex: /\bbg-slate-50\b(?!\/)/, name: 'bg-slate-50', riskBase: 'HIGH' },
  { regex: /\bbg-slate-100\b(?!\/)/, name: 'bg-slate-100', riskBase: 'HIGH' },
  { regex: /\bbg-zinc-50\b(?!\/)/, name: 'bg-zinc-50', riskBase: 'HIGH' },
  { regex: /\bbg-zinc-100\b(?!\/)/, name: 'bg-zinc-100', riskBase: 'HIGH' },
  { regex: /\bbg-stone-50\b(?!\/)/, name: 'bg-stone-50', riskBase: 'HIGH' },
  { regex: /\bbg-stone-100\b(?!\/)/, name: 'bg-stone-100', riskBase: 'HIGH' },
  { regex: /\bbg-\[#f[0-9a-fA-F]{2,}\]/, name: 'light-hex-bg', riskBase: 'MEDIUM' },
  { regex: /\bbg-\[#[eE][0-9a-fA-F]{2,}\]/, name: 'light-hex-bg', riskBase: 'MEDIUM' },
];

// Heuristic: does this line look like a panel / card / surface?
const panelIndicator = /\b(div|section|article|aside|main|header|footer|nav|Card)\b|\b(rounded|p-[0-9]|px-|py-|pt-|pb-|pl-|pr-|shadow|border-|min-h-|min-w-|w-full|h-full|max-w-|flex-|grid|space-y|gap-)\b/;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, files);
    else if (/\.(tsx|jsx|ts|js|css|html)$/.test(entry)) files.push(full);
  }
  return files;
}

const results = [];
for (const file of walk(root)) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const rel = relative('.', file);

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    for (const p of patterns) {
      if (!p.regex.test(line)) continue;

      const hasDarkBg = /\bdark:bg-/.test(line);
      const hasDark = /\bdark:/.test(line);
      const looksLikePanel = panelIndicator.test(line);

      let risk;
      if (hasDarkBg) {
        risk = 'LOW';
      } else if (hasDark && !hasDarkBg) {
        risk = 'LOW';
      } else if (looksLikePanel) {
        risk = p.riskBase;
      } else {
        risk = 'LOW';
      }

      results.push({
        file: rel,
        line: idx + 1,
        text: line,
        match: p.name,
        risk,
        missingDarkBg: !hasDarkBg,
        looksLikePanel,
      });
    }
  });
}

// Group by file
const byFile = new Map();
for (const r of results) {
  if (!byFile.has(r.file)) byFile.set(r.file, []);
  byFile.get(r.file).push(r);
}

for (const [file, matches] of byFile) {
  console.log(`\n${file}`);
  for (const m of matches) {
    const flag = m.missingDarkBg && m.looksLikePanel ? ' [PANEL, NO dark:]' : '';
    console.log(`  Line ${m.line} | ${m.risk}${flag}`);
    console.log(`    Match: ${m.match}`);
    console.log(`    ${m.text.slice(0, 140)}${m.text.length > 140 ? '…' : ''}`);
  }
}

// Summary
const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
for (const r of results) counts[r.risk]++;

console.log(`\n--- Summary ---`);
console.log(`Total matches: ${results.length}`);
console.log(`  CRITICAL : ${counts.CRITICAL}  (bg-white panels missing dark:)`);
console.log(`  HIGH     : ${counts.HIGH}    (light gray panels missing dark:)`);
console.log(`  MEDIUM   : ${counts.MEDIUM}  (light hex panels missing dark:)`);
console.log(`  LOW      : ${counts.LOW}     (has dark: override or decorative)`);
