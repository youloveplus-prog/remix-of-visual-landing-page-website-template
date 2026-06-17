import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Pick a MediaRecorder mimeType the browser actually supports,
// and report a matching file extension so the upstream STT model
// can infer the audio format correctly.
function pickRecorderMime(): { mime: string; ext: string } {
  const candidates: Array<{ mime: string; ext: string }> = [
    { mime: "audio/webm;codecs=opus", ext: "webm" },
    { mime: "audio/webm", ext: "webm" },
    { mime: "audio/mp4", ext: "mp4" },
    { mime: "audio/mpeg", ext: "mp3" },
    { mime: "audio/ogg;codecs=opus", ext: "ogg" },
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c.mime)) {
      return c;
    }
  }
  return { mime: "", ext: "webm" };
}

export function VoiceInput({ onTranscript, disabled, className }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "transcribing">("idle");
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startRecording = useCallback(async () => {
    if (disabled || state !== "idle") return;
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Voice input isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const { mime } = pickRecorderMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.start();
      startedAtRef.current = Date.now();
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 250);
      setState("recording");
    } catch (err) {
      console.error("voice start failed", err);
      toast.error("Couldn't access the microphone. Check browser permissions.");
      cleanup();
      setState("idle");
    }
  }, [cleanup, disabled, state]);

  const stopAndTranscribe = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      cleanup();
      setState("idle");
      return;
    }

    const done = new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        resolve(new Blob(chunksRef.current, { type }));
      };
    });
    recorder.stop();
    if (timerRef.current) clearInterval(timerRef.current);

    setState("transcribing");
    try {
      const blob = await done;
      cleanup();

      if (blob.size < 200) {
        toast.message("Too short — try holding the mic a moment longer.");
        setState("idle");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token ?? "";

      const fd = new FormData();
      const ext = (blob.type.split(";")[0].split("/")[1] || "webm").toLowerCase();
      fd.append("audio", blob, `recording.${ext}`);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-tutor-transcribe`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Transcribe failed (${res.status})`);
      }
      const json = (await res.json()) as { text?: string };
      const text = (json.text ?? "").trim();
      if (!text) {
        toast.message("Didn't catch that — try again.");
      } else {
        onTranscript(text);
      }
    } catch (err) {
      console.error("transcribe failed", err);
      toast.error("Couldn't transcribe — please try typing.");
    } finally {
      setState("idle");
    }
  }, [cleanup, onTranscript]);

  const onClick = useCallback(() => {
    if (state === "idle") void startRecording();
    else if (state === "recording") void stopAndTranscribe();
  }, [state, startRecording, stopAndTranscribe]);

  const mm = String(Math.floor(elapsed / 60)).padStart(1, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state === "transcribing"}
      aria-label={
        state === "recording"
          ? "Stop recording and transcribe"
          : state === "transcribing"
            ? "Transcribing"
            : "Record a voice question"
      }
      title={state === "recording" ? `Recording ${mm}:${ss} — tap to stop` : "Voice input"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-8 min-w-8 px-2 rounded-md text-sm transition-colors",
        state === "idle" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        state === "recording" &&
          "bg-destructive/15 text-destructive ring-1 ring-destructive/40",
        state === "transcribing" && "text-muted-foreground",
        className,
      )}
    >
      {state === "recording" ? (
        <>
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-destructive animate-pulse"
          />
          <Square className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px] tabular-nums">
            {mm}:{ss}
          </span>
        </>
      ) : state === "transcribing" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}
