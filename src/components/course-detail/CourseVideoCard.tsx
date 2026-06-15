import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  poster?: string | null;
  src?: string | null;
  title: string;
  /** Stable key (e.g. course slug) used to persist playback position. */
  resumeKey?: string;
}

const STORAGE_PREFIX = "asikon:course-video:";
// Don't restore if user finished within this many seconds of the end.
const END_THRESHOLD = 5;

const FALLBACK_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CourseVideoCard({ poster, src, title, resumeKey }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [started, setStarted] = useState(false);

  const togglePlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      try {
        await v.play();
        setStarted(true);
      } catch {/* ignored */}
    } else {
      v.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * duration;
    setCurrent(v.currentTime);
  };

  // Resume from saved timestamp once metadata is ready.
  const restoredRef = useRef(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const storageKey = resumeKey ? `${STORAGE_PREFIX}${resumeKey}` : null;

    const tryRestore = () => {
      if (restoredRef.current || !storageKey) return;
      const raw = localStorage.getItem(storageKey);
      const saved = raw ? Number(raw) : NaN;
      if (
        Number.isFinite(saved) &&
        saved > 1 &&
        v.duration > 0 &&
        saved < v.duration - END_THRESHOLD
      ) {
        try { v.currentTime = saved; } catch { /* ignored */ }
      }
      restoredRef.current = true;
    };

    let saveTick = 0;
    const persist = () => {
      if (!storageKey) return;
      if (v.duration > 0 && v.currentTime >= v.duration - END_THRESHOLD) {
        localStorage.removeItem(storageKey);
      } else if (v.currentTime > 1) {
        localStorage.setItem(storageKey, String(v.currentTime));
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => { setPlaying(false); persist(); };
    const onTime = () => {
      setCurrent(v.currentTime);
      // throttle writes to ~1/sec
      if (++saveTick % 4 === 0) persist();
    };
    const onMeta = () => {
      setDuration(v.duration || 0);
      tryRestore();
    };
    const onEnded = () => { if (storageKey) localStorage.removeItem(storageKey); };
    const onVisibility = () => { if (document.hidden) persist(); };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", persist);

    // If metadata is already loaded by the time effect runs.
    if (v.readyState >= 1) onMeta();

    return () => {
      persist();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", persist);
    };
  }, [resumeKey]);

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const videoSrc = src ?? FALLBACK_SRC;

  return (
    <div ref={containerRef} className="surface-panel rounded-3xl overflow-hidden">
      <div className="relative aspect-video w-full bg-black group">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster ?? undefined}
          preload="metadata"
          playsInline
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
          aria-label={title}
        />

        {/* dim overlay only when not playing */}
        {!playing && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        )}

        {/* big play / pause button — hides while playing, reappears on hover */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
          className={[
            "absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-background/85 backdrop-blur-md grid place-items-center shadow-xl transition-all",
            playing
              ? "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
              : "opacity-100 scale-100 hover:scale-105",
          ].join(" ")}
        >
          {playing ? (
            <Pause className="w-6 h-6 text-foreground fill-foreground" />
          ) : (
            <Play className="w-6 h-6 text-foreground fill-foreground translate-x-[1px]" />
          )}
        </button>

        {/* controls bar */}
        <div
          className={[
            "absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-background/30 backdrop-blur-md px-3 py-2 text-white transition-opacity",
            started && playing ? "opacity-0 group-hover:opacity-100" : "opacity-100",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="w-7 h-7 grid place-items-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {playing ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
          </button>

          <div className="relative flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full bg-primary pointer-events-none"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={onSeek}
              aria-label="Seek"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <span className="font-mono text-[11px] tabular-nums whitespace-nowrap">
            {fmt(current)} / {fmt(duration)}
          </span>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
