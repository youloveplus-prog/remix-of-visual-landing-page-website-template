import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevisionDue, useGradeRevision } from "@/hooks/useRevision";
import { toast } from "sonner";

interface Props {
  /** When true, render a compact summary card; otherwise the full reviewer. */
  compact?: boolean;
}

export function RevisionPanel({ compact = false }: Props) {
  const navigate = useNavigate();
  const { data: due, isLoading } = useRevisionDue(20);
  const grade = useGradeRevision();
  const [index, setIndex] = useState(0);

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-2xl" />;
  }

  if (!due || due.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 flex items-center gap-3">
        <Brain className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Nothing to revise today</p>
          <p className="text-xs text-muted-foreground">
            Finish a lesson — it auto-joins your revision queue.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={() => navigate("/revision")}
        className="w-full text-left rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 p-4 flex items-center gap-3 hover:from-primary/20 transition"
      >
        <Brain className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            {due.length} item{due.length === 1 ? "" : "s"} due for revision
          </p>
          <p className="text-xs text-muted-foreground">Spaced repetition keeps it sticky.</p>
        </div>
        <Sparkles className="h-4 w-4 text-primary" />
      </button>
    );
  }

  const item = due[index];
  const lesson = item.lessons;

  const handleGrade = async (g: number) => {
    try {
      await grade.mutateAsync({ lessonId: item.lesson_id, grade: g });
      if (index + 1 < due.length) {
        setIndex(index + 1);
      } else {
        toast.success("Revision complete for today!");
        setIndex(0);
      }
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Revision {index + 1} of {due.length}
        </p>
        <Brain className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold leading-snug">
          {lesson?.title ?? "Lesson"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          How confidently can you recall this?
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => handleGrade(1)}
          disabled={grade.isPending}
        >
          <X className="h-4 w-4 mr-1" /> Hard
        </Button>
        <Button
          variant="outline"
          onClick={() => handleGrade(3)}
          disabled={grade.isPending}
        >
          OK
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => handleGrade(5)}
          disabled={grade.isPending}
        >
          <Check className="h-4 w-4 mr-1" /> Easy
        </Button>
      </div>
      {lesson && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/learn`)}
        >
          Open lesson chat
        </Button>
      )}
    </div>
  );
}
