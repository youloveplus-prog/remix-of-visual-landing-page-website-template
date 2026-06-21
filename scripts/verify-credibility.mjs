#!/usr/bin/env node
/**
 * Build-time + CI validation for homepage credibility copy.
 *
 * - Scans homepage source files for "banned" phrases (vague volume claims,
 *   hard-coded ratings/review counts) that must not appear unless backed
 *   by a registered, Supabase-validated claim.
 * - For every entry in `claims`, runs the declared Supabase assertion
 *   against the live database and fails the build if the data does not
 *   support the copy.
 *
 * Registry: scripts/credibility-claims.json
 *
 * Skips Supabase validation (with a warning, not an error) when network
 * or env vars are unavailable, so local builds without internet still work.
 * In CI, set CREDIBILITY_STRICT=1 to fail in that case instead.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY = JSON.parse(
  fs.readFileSync(path.join(__dirname, "credibility-claims.json"), "utf8"),
);

const STRICT = process.env.CREDIBILITY_STRICT === "1";

const errors = [];
const warnings = [];

// ---------- 1. Static scan for banned phrases ----------
const files = REGISTRY.scanGlobs.flatMap((g) =>
  globSync(g, { cwd: ROOT, absolute: true, nodir: true }),
);

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  for (const rule of REGISTRY.banned) {
    const re = new RegExp(rule.pattern, "gim");
    let m;
    while ((m = re.exec(src)) !== null) {
      // Allow if a registered claim explicitly covers this exact phrase in this file.
      const allowed = REGISTRY.claims.some(
        (c) => c.files.includes(rel) && m[0].includes(c.phrase),
      );
      if (allowed) continue;
      const line = src.slice(0, m.index).split("\n").length;
      errors.push(
        `[banned:${rule.id}] ${rel}:${line} — "${m[0]}"\n  ${rule.reason}`,
      );
    }
  }
}

// ---------- 2. Verify registered claims exist in source ----------
for (const claim of REGISTRY.claims) {
  for (const rel of claim.files) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`[claim:${claim.id}] missing file ${rel}`);
      continue;
    }
    const src = fs.readFileSync(abs, "utf8");
    if (!src.includes(claim.phrase)) {
      errors.push(
        `[claim:${claim.id}] phrase not found in ${rel}: "${claim.phrase}". Remove the claim from the registry or restore the copy.`,
      );
    }
  }
}

// ---------- 3. Supabase-backed assertions ----------
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || readEnvFile("VITE_SUPABASE_URL");
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  readEnvFile("VITE_SUPABASE_PUBLISHABLE_KEY");

function readEnvFile(key) {
  try {
    const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
    const m = env.match(new RegExp(`^${key}\\s*=\\s*"?([^"\\n]+)"?`, "m"));
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

async function pgRest(pathAndQuery) {
  const url = `${SUPABASE_URL}/rest/v1/${pathAndQuery}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
      Prefer: "count=exact",
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status} for ${pathAndQuery}: ${await res.text()}`);
  }
  const total = Number(res.headers.get("content-range")?.split("/").pop());
  const body = await res.json();
  return { total: Number.isFinite(total) ? total : body.length, body };
}

async function evaluate(assertion) {
  switch (assertion.type) {
    case "always":
      return { ok: true, detail: "no DB check required" };
    case "count_at_least": {
      const { total } = await pgRest(`${assertion.table}?select=id`);
      return {
        ok: total >= assertion.min,
        detail: `${assertion.table} count=${total} (min ${assertion.min})`,
      };
    }
    case "avg_at_least": {
      const { body } = await pgRest(
        `${assertion.table}?select=${assertion.column}`,
      );
      const vals = body
        .map((r) => Number(r[assertion.column]))
        .filter((n) => Number.isFinite(n));
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return {
        ok: avg >= assertion.min,
        detail: `${assertion.table}.${assertion.column} avg=${avg.toFixed(2)} (min ${assertion.min})`,
      };
    }
    default:
      return { ok: false, detail: `unknown assertion type ${assertion.type}` };
  }
}

const checkable = REGISTRY.claims.filter((c) => c.assertion.type !== "always");
if (checkable.length > 0) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const msg = "Supabase env vars missing — skipping live claim assertions.";
    if (STRICT) errors.push(`[supabase] ${msg}`);
    else warnings.push(msg);
  } else {
    for (const claim of checkable) {
      try {
        const r = await evaluate(claim.assertion);
        if (!r.ok) {
          errors.push(
            `[claim:${claim.id}] assertion failed — ${r.detail}. Update the copy or seed the data before deploying.`,
          );
        } else {
          console.log(`  ✓ ${claim.id} — ${r.detail}`);
        }
      } catch (e) {
        const msg = `[claim:${claim.id}] could not evaluate: ${e.message}`;
        if (STRICT) errors.push(msg);
        else warnings.push(msg);
      }
    }
  }
}

// ---------- Report ----------
console.log(
  `\nCredibility check: ${REGISTRY.claims.length} claim(s), ${files.length} file(s) scanned.`,
);
for (const w of warnings) console.warn(`  ! ${w}`);
if (errors.length) {
  console.error("\nCredibility check FAILED:\n");
  for (const e of errors) console.error("  ✗ " + e + "\n");
  process.exit(1);
}
console.log("Credibility check passed.\n");
