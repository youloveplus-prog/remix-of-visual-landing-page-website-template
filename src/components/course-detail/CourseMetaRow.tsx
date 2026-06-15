import { Star, Clock, BookOpen } from "lucide-react";

interface Props {
  instructorName: string;
  instructorHandle?: string;
  instructorAvatar?: string | null;
  rating: number;
  duration: string;
  lessons: number;
}

export function CourseMetaRow({ instructorName, instructorHandle, instructorAvatar, rating, duration, lessons }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
          {instructorAvatar ? (
            <img src={instructorAvatar} alt={instructorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-xs font-semibold text-muted-foreground">
              {instructorName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight truncate">{instructorName}</div>
          {instructorHandle && (
            <div className="text-xs text-muted-foreground truncate">{instructorHandle}</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip icon={<Star className="w-3.5 h-3.5 fill-primary text-primary" />} label={rating.toFixed(1)} />
        <Chip icon={<Clock className="w-3.5 h-3.5 text-primary" />} label={duration} />
        <Chip icon={<BookOpen className="w-3.5 h-3.5 text-primary" />} label={`${lessons} Lessons`} />
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-foreground px-3 py-1 text-xs font-medium">
      {icon}
      {label}
    </span>
  );
}
