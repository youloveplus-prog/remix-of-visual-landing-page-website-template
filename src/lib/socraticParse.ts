/**
 * Parses the structured metadata header the Socratic tutor emits on the
 * first line of every reply, e.g.
 *   [ASIKON step=plan hint=1 topic=math.quadratic attempt=yes]
 *
 * Returns the parsed metadata + the body text with the header stripped.
 * If no header is found (e.g. mid-stream before the first newline arrives),
 * `meta` is null and `body` is the original text.
 */

export type SocraticStep = "understand" | "plan" | "try" | "check" | "direct";

export interface SocraticMeta {
  step: SocraticStep | null;
  hint_level: number | null;
  topic_hint: string | null;
  requires_attempt: boolean;
}

export interface ParsedSocratic {
  meta: SocraticMeta | null;
  body: string;
}

const HEADER_RE = /^\s*\[ASIKON\s+([^\]]+)\]\s*\n?/;

const STEPS: SocraticStep[] = ["understand", "plan", "try", "check", "direct"];

export function parseSocratic(text: string): ParsedSocratic {
  if (!text) return { meta: null, body: text };

  const match = text.match(HEADER_RE);
  if (!match) return { meta: null, body: text };

  const fields = match[1];
  const body = text.slice(match[0].length).replace(/^\n+/, "");

  // Parse key=value pairs separated by whitespace
  const pairs: Record<string, string> = {};
  const fieldRe = /(\w+)=([^\s\]]+)/g;
  let m: RegExpExecArray | null;
  while ((m = fieldRe.exec(fields)) !== null) {
    pairs[m[1].toLowerCase()] = m[2];
  }

  const rawStep = pairs.step?.toLowerCase();
  const step = (STEPS.includes(rawStep as SocraticStep) ? rawStep : null) as
    | SocraticStep
    | null;

  const hintRaw = pairs.hint;
  const hint_level = hintRaw !== undefined && /^[0-5]$/.test(hintRaw)
    ? parseInt(hintRaw, 10)
    : null;

  const topic_hint = pairs.topic ?? null;
  const requires_attempt = (pairs.attempt ?? "").toLowerCase() === "yes";

  return {
    meta: { step, hint_level, topic_hint, requires_attempt },
    body,
  };
}

export const STEP_ORDER: SocraticStep[] = ["understand", "plan", "try", "check"];

export const STEP_LABELS: Record<SocraticStep, string> = {
  understand: "Understand",
  plan: "Plan",
  try: "Try",
  check: "Check",
  direct: "Direct",
};
