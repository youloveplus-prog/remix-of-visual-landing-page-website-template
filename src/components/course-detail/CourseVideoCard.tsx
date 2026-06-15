import { Play, Volume2, Maximize2 } from "lucide-react";

interface Props {
  poster?: string | null;
  title: string;
  currentTime?: string;
  totalTime?: string;
  progress?: number; // 0-100
}

export function CourseVideoCard({ poster, title, currentTime = "00:46", totalTime = "30:45", progress = 35 }: Props) {
  return (
    <div className="surface-panel rounded-3xl overflow-hidden">
      <div className="relative aspect-video w-full bg-muted">
        {poster ? (
          <img src={poster} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
        {/* dim overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* play button */}
        <button
          aria-label="Play video"
          className="absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-background/85 backdrop-blur-md grid place-items-center shadow-xl hover:scale-105 transition-transform"
        >
          <Play className="w-6 h-6 text-foreground fill-foreground translate-x-[1px]" />
        </button>

        {/* controls bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-background/30 backdrop-blur-md px-3 py-2 text-white">
          <button aria-label="Play" className="w-7 h-7 grid place-items-center rounded-full bg-white/20">
            <Play className="w-3.5 h-3.5 fill-white" />
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-[11px] tabular-nums whitespace-nowrap">
            {currentTime} / {totalTime}
          </span>
          <Maximize2 className="w-4 h-4 opacity-80" />
          <Volume2 className="w-4 h-4 opacity-80" />
        </div>
      </div>
    </div>
  );
}
