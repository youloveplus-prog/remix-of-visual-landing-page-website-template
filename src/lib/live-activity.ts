// Formatting helpers for live activity events.
// Event data is now sourced from Supabase (see useLiveActivity hook).

export type LiveActivityKind = "purchase" | "review" | "enrolment" | "milestone";

export interface LiveActivity {
  id: string;
  kind: LiveActivityKind;
  name: string;
  item: string;
  rating?: number;
  occurredAt: string; // ISO
}

/** "Ayesha Rahman" -> "Ayesha R."  Empty / single-word names are returned as-is. */
export function privatizeName(full: string | null | undefined): string {
  if (!full) return "Someone";
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export function minutesAgo(iso: string): number {
  return Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export function timeAgoLabel(iso: string): string {
  const m = minutesAgo(iso);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function describeActivity(a: LiveActivity): { title: string; description: string } {
  const who = a.name;
  switch (a.kind) {
    case "purchase":
      return { title: `${who} just bought`, description: a.item };
    case "review":
      return {
        title: `${who} left a ${a.rating ?? 5}★ review`,
        description: `on “${a.item}”`,
      };
    case "enrolment":
      return { title: `${who} enrolled in`, description: a.item };
    case "milestone":
      return { title: who, description: a.item };
  }
}

export function activityEmoji(kind: LiveActivityKind): string {
  switch (kind) {
    case "purchase": return "🛒";
    case "review": return "⭐";
    case "enrolment": return "🎓";
    case "milestone": return "🏆";
  }
}
