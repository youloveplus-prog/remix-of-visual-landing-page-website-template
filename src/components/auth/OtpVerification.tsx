import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, Mail, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OtpVerificationProps {
  email: string;
  loading?: boolean;
  /** Server-side error (e.g. "Invalid code", "Code expired"). Cleared by parent on retry. */
  error?: string | null;
  /** Called when the user submits a 6-digit code. */
  onVerify: (code: string) => void | Promise<void>;
  /** Called when the user requests a new code. Resolve when resend succeeds. */
  onResend: () => Promise<void> | void;
  /** Back to previous step (e.g. register form). */
  onBack: () => void;
  /** Initial seconds before resend is allowed. Default 60. */
  resendSeconds?: number;
}

const CODE_LENGTH = 6;

export function OtpVerification({
  email,
  loading = false,
  error,
  onVerify,
  onResend,
  onBack,
  resendSeconds = 60,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);
  const [resending, setResending] = useState(false);
  const [resentAt, setResentAt] = useState<number | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => digits.join(""), [digits]);
  const complete = code.length === CODE_LENGTH && /^\d{6}$/.test(code);

  // Resend cooldown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  // Autofocus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (complete && !loading) {
      onVerify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  // Clear digits when parent surfaces a fresh error after a verify attempt
  useEffect(() => {
    if (error) {
      setDigits(Array(CODE_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    }
  }, [error]);

  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    setDigits((prev) => {
      const next = [...prev];
      if (clean.length === 0) {
        next[i] = "";
      } else if (clean.length === 1) {
        next[i] = clean;
      } else {
        // Pasted multiple chars into one box -> distribute
        for (let k = 0; k < clean.length && i + k < CODE_LENGTH; k++) {
          next[i + k] = clean[k];
        }
      }
      return next;
    });
    if (clean.length >= 1) {
      const target = Math.min(i + clean.length, CODE_LENGTH - 1);
      inputsRef.current[target]?.focus();
    }
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) {
      e.preventDefault();
      inputsRef.current[i + 1]?.focus();
    } else if (e.key === "Enter" && complete && !loading) {
      e.preventDefault();
      onVerify(code);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputsRef.current[Math.min(text.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    try {
      await onResend();
      setSecondsLeft(resendSeconds);
      setResentAt(Date.now());
      setDigits(Array(CODE_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-7">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-[26px] lg:text-[32px] font-semibold tracking-tight leading-[1.1]">
          Verify your email.
        </h2>
        <p className="text-muted-foreground text-[14px] mt-2">
          Enter the 6-digit code we sent to{" "}
          <strong className="text-foreground font-medium break-all">{email}</strong>.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (complete && !loading) onVerify(code);
        }}
        className="space-y-5"
      >
        <div
          className="flex gap-2 sm:gap-2.5 justify-between"
          aria-label="One-time passcode"
          role="group"
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={CODE_LENGTH}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={onKeyDown(i)}
              onPaste={onPaste}
              disabled={loading}
              aria-label={`Digit ${i + 1}`}
              aria-invalid={!!error}
              className={cn(
                "h-12 sm:h-14 w-full min-w-0 rounded-xl border bg-card text-center text-xl sm:text-2xl font-semibold",
                "outline-none transition-all duration-150",
                "focus:border-primary focus:ring-2 focus:ring-primary/30 focus:-translate-y-0.5",
                error
                  ? "border-destructive/70 text-destructive bg-destructive/5"
                  : d
                    ? "border-primary/40 text-foreground"
                    : "border-border text-foreground",
                loading && "opacity-60 cursor-not-allowed",
              )}
            />
          ))}
        </div>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : resentAt ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-[13px] text-emerald-700 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>A new code was sent. Check your inbox.</span>
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={!complete || loading}
          className="w-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {loading ? "Verifying…" : "Verify & continue"}
        </Button>

        <div className="pt-1 text-center text-[13px] text-muted-foreground">
          Didn't get the code?{" "}
          {secondsLeft > 0 ? (
            <span className="text-foreground/70">
              Resend in <span className="font-semibold tabular-nums">{secondsLeft}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline underline-offset-4 disabled:opacity-60"
            >
              {resending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Resend code
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Codes expire in 10 minutes. Never share them.
        </div>
      </form>
    </div>
  );
}

export default OtpVerification;
