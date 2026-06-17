import { Calendar, ClipboardList, Sparkles } from "lucide-react";
import { useSessionNotes } from "@/hooks/useTrust";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileCard } from "@/components/ui/mobile-card";
import { cn } from "@/lib/utils";

/**
 * Lists session notes visible to the signed-in user.
 * - Mentors see their own notes.
 * - Parents see notes for linked, verified students.
 * - Empty state explains the feature for first-time parents.
 */
export function SessionNotesPanel({ className }: { className?: string }) {
  const { data, isLoading } = useSessionNotes();

  if (isLoading) {
    return <Skeleton className={cn("h-40 w-full rounded-3xl", className)} />;
  }

  if (!data || data.length === 0) {
    return (
      <MobileCard variant="glass" className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-primary/10 grid place-items-center text-primary">
            <ClipboardList className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold leading-tight">
              Session notes
            </h3>
            <p className="text-[11.5px] text-muted-foreground">
              For verified parents & their mentors
            </p>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          After every 1-on-1 session, your mentor writes a short summary:
          topics covered, what your child did well, where to focus next, and
          a small piece of homework. Once linked to your child, you'll see
          them here.
        </p>
      </MobileCard>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((n) => (
        <MobileCard key={n.id} variant="glass" className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold leading-tight">
                {n.student_name}
              </p>
              <p className="text-[11.5px] text-muted-foreground inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(n.session_date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                {n.duration_minutes && <> · {n.duration_minutes} min</>}
              </p>
            </div>
            {n.topics_covered.length > 0 && (
              <span className="text-[10.5px] text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                {n.topics_covered.length} topic{n.topics_covered.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
          {n.topics_covered.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {n.topics_covered.map((t) => (
                <span
                  key={t}
                  className="text-[10.5px] text-foreground bg-secondary/60 border border-border rounded-full px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {n.strengths && (
            <Field label="Strengths" tone="positive">
              {n.strengths}
            </Field>
          )}
          {n.growth_areas && <Field label="Growth areas">{n.growth_areas}</Field>}
          {n.homework && (
            <Field label="Homework" icon={<Sparkles className="h-3 w-3" />}>
              {n.homework}
            </Field>
          )}
        </MobileCard>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
  tone,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  tone?: "positive";
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-[10.5px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-1",
          tone === "positive" ? "text-emerald-600 dark:text-emerald-300" : "text-muted-foreground",
        )}
      >
        {icon}
        {label}
      </p>
      <p className="text-[13px] text-foreground leading-relaxed mt-0.5">{children}</p>
    </div>
  );
}
