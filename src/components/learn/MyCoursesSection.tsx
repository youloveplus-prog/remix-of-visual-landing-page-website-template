import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MobileSection } from "@/components/ui/mobile-section";
import { MobileCard } from "@/components/ui/mobile-card";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useAuth } from "@/hooks/useAuth";

export function MyCoursesSection() {
  const { user } = useAuth();
  const { data: enrollments = [], isLoading } = useEnrollments();

  if (!user) return null;
  if (isLoading || enrollments.length === 0) return null;

  return (
    <MobileSection
      title="My courses"
      subtitle="Pick up where you left off"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {enrollments.map((e) => {
          const item = e.content_items;
          if (!item) return null;
          const done = e.progress >= 100;
          return (
            <Link
              key={e.id}
              to={`/content/${item.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 pressable"
            >
              {item.cover_url ? (
                <img
                  src={item.cover_url}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground grid place-items-center shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold leading-tight truncate">{item.title}</p>
                  {done && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={Math.round(e.progress)} className="h-1 flex-1" />
                  <span className="text-[10.5px] tabular-nums text-muted-foreground shrink-0">
                    {Math.round(e.progress)}%
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          );
        })}
      </div>
    </MobileSection>
  );
}
