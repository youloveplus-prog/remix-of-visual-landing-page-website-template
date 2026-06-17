import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Loader2,
  Sparkles,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Code2 as Github,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { z } from "zod";
import asikonLogo from "@/assets/logo.png";
import { SEO } from "@/components/SEO";
import { OtpVerification } from "@/components/auth/OtpVerification";

// ---- Validation -----------------------------------------------------------
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const RESERVED_USERNAMES = ["admin", "moderator", "system", "support", "root", "administrator"];

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, underscores and hyphens only")
    .refine((v) => !RESERVED_USERNAMES.includes(v.toLowerCase()), "This username is reserved"),
  fullName: z
    .string()
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]*$/, "Letters, spaces, hyphens and apostrophes only")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Too long"),
});

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type AuthView = "login" | "register" | "forgot-password" | "otp";

// ---- Floating-label themed input -----------------------------------------
interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  trailing?: React.ReactNode;
  hint?: string;
}

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  required,
  trailing,
  hint,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const float = focused || filled;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          placeholder=" "
          className={cn(
            "peer w-full rounded-xl bg-secondary/60 border border-transparent px-4 pt-5 pb-2 text-[15px] text-foreground",
            "outline-none transition-all duration-200",
            "focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10",
            error
              ? "border-destructive/60 focus:border-destructive focus:ring-destructive/10"
              : "",
            trailing && "pr-12",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-150 origin-left",
            float
              ? "top-1.5 text-[10.5px] font-medium tracking-wider uppercase text-muted-foreground"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            error && float && "text-destructive",
          )}
        >
          {label}
        </label>
        {trailing && (
          <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="text-xs text-destructive ml-1">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[11px] text-muted-foreground ml-1">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

// ---- Password strength meter ---------------------------------------------
function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}
const STRENGTH_LABEL = ["Too short", "Weak", "Fair", "Strong", "Excellent"];
const STRENGTH_COLOR = [
  "bg-destructive/70",
  "bg-destructive/70",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-500",
];

// ---- Page -----------------------------------------------------------------
const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeView, setActiveView] = useState<AuthView>("login");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem("asikon:lastEmail") || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // OTP verification (after signup)
  const [otpEmail, setOtpEmail] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  // Smart redirect after login (preserve ?redirect=/path)
  const redirectTo = params.get("redirect") || "/";

  useEffect(() => {
    if (!authLoading && user) navigate(redirectTo, { replace: true });
  }, [user, authLoading, navigate, redirectTo]);

  const clearErrors = () => setErrors({});
  const collect = (r: z.SafeParseReturnType<any, any>) => {
    if (r.success) return false;
    const f: Record<string, string> = {};
    r.error.errors.forEach((e) => {
      if (e.path[0]) f[e.path[0] as string] = e.message;
    });
    setErrors(f);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (collect(loginSchema.safeParse({ email: loginEmail, password: loginPassword }))) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials"))
          throw new Error("Invalid email or password. Please try again.");
        if (error.message.includes("Email not confirmed"))
          throw new Error("Please verify your email before signing in.");
        throw error;
      }
      if (rememberMe) localStorage.setItem("asikon:lastEmail", loginEmail);
      else localStorage.removeItem("asikon:lastEmail");
      toast({ title: "Welcome back!", description: "Continuing your learning journey…" });
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (
      collect(
        registerSchema.safeParse({
          username: registerUsername,
          fullName: registerFullName,
          email: registerEmail,
          password: registerPassword,
        }),
      )
    )
      return;
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { username: registerUsername, full_name: registerFullName },
        },
      });
      if (error) {
        if (error.message.includes("already registered"))
          throw new Error("This email is already registered. Please sign in instead.");
        throw error;
      }
      if (data.user && !data.session) {
        // Email confirmation required — switch to OTP verification screen
        setOtpEmail(registerEmail);
        setLoginEmail(registerEmail);
        setOtpError(null);
        setActiveView("otp");
        toast({
          title: "Check your inbox",
          description: "We sent a 6-digit code to verify your email.",
        });
      } else if (data.session) {
        toast({ title: "Welcome to Asikon!", description: "Your account is ready." });
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setOtpLoading(true);
    setOtpError(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: code,
        type: "signup",
      });
      if (error) {
        const msg = error.message?.toLowerCase() ?? "";
        if (msg.includes("expired"))
          throw new Error("This code has expired. Please request a new one.");
        if (msg.includes("invalid") || msg.includes("token"))
          throw new Error("That code isn't right. Double-check and try again.");
        throw error;
      }
      if (data.session) {
        toast({ title: "Email verified", description: "Welcome to Asikon!" });
        navigate(redirectTo, { replace: true });
      } else {
        // Verified but no session — fall back to login
        setActiveView("login");
        toast({ title: "Email verified", description: "You can sign in now." });
      }
    } catch (err: any) {
      setOtpError(err.message || "Verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: otpEmail,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (err: any) {
      setOtpError(err.message || "Couldn't resend the code. Please try again shortly.");
      throw err;
    }
  };



  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (collect(forgotSchema.safeParse({ email: forgotEmail }))) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      toast({ title: "Reset link sent", description: "Check your inbox." });
    } catch (err: any) {
      toast({
        title: "Couldn't send reset email",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectTo}` },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({
        title: `${provider === "google" ? "Google" : "GitHub"} sign-in unavailable`,
        description:
          err.message ||
          "This provider isn't enabled yet. Use email & password or contact support.",
        variant: "destructive",
      });
      setOauthLoading(null);
    }
  };

  const pwScore = useMemo(() => passwordStrength(registerPassword), [registerPassword]);

  if (authLoading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative min-h-dvh w-full bg-background">
      <SEO
        title="Sign in"
        description="Sign in or create your Asikon account to access AI tutoring, courses, and the learner community."
      />

      <div className="relative grid md:grid-cols-2 min-h-dvh">
        {/* ============== Video brand pane (desktop only) ============== */}
        <aside className="hidden md:flex relative flex-col justify-between p-8 lg:p-12 xl:p-16 overflow-hidden border-r border-border bg-[#0a0a1a] text-white">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.pexels.com/videos/3129957/free-video-3129957.jpg?auto=compress&cs=tinysrgb&w=1280"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          >
            <source
              src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>
          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a]/90 via-[#141432]/70 to-[#1e1e5a]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />

          {/* Content above video */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center p-1.5">
              <img src={asikonLogo} alt="Asikon" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-display text-[15px] font-semibold tracking-tight">Asikon</p>
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-white/60">
                Learn AI · Build Skills
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-8 max-w-md">
            <div className="inline-flex items-center gap-2 text-[11.5px] text-white/70 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5">
              <Flame className="h-3.5 w-3.5 text-[#a5b4fc]" />
              Trusted by 12,400+ learners
            </div>
            <h1 className="font-display text-4xl xl:text-5xl font-semibold leading-[1.05] tracking-tight">
              Your AI learning
              <br />
              journey starts here.
            </h1>
            <p className="text-[15px] text-white/75 leading-relaxed">
              Master ML, Python, and modern AI tools with expert-led courses,
              a 24/7 AI tutor, and a community building real projects.
            </p>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { icon: GraduationCap, title: "Expert courses", sub: "200+ lessons" },
                { icon: Sparkles, title: "AI tutor", sub: "Bangla + English" },
                { icon: BookOpen, title: "Prompt library", sub: "1,000+ prompts" },
                { icon: ShieldCheck, title: "Lifetime access", sub: "Yours forever" },
              ].map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <f.icon className="h-4 w-4 mt-1 text-[#a5b4fc] shrink-0" />
                  <div>
                    <p className="text-[13.5px] font-medium leading-tight text-white">{f.title}</p>
                    <p className="text-[12px] text-white/60 mt-0.5">{f.sub}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Floating testimonial card */}
            <figure className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-5 shadow-2xl shadow-black/40">
              <blockquote className="text-[14px] text-white/90 leading-relaxed">
                "The AI tutor answered my doubts at 2 a.m. before exams. Asikon
                doesn't just teach — it learns with you."
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#a78bfa] grid place-items-center text-xs font-semibold text-white shadow-lg shadow-indigo-500/30">
                  S
                </div>
                <div>
                  <p className="text-[12.5px] font-medium text-white">Sadia R.</p>
                  <p className="text-[11px] text-white/60">ML Engineer · Class of 2025</p>
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11.5px] text-white/60">
            <p>© {new Date().getFullYear()} Asikon Technologies</p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Bank-grade encryption</span>
            </div>
          </div>
        </aside>

        {/* ============== Form pane ============== */}
        <section
          className="relative flex flex-col px-5 sm:px-8 pt-[max(2rem,env(safe-area-inset-top))] md:py-10 lg:py-14 min-h-dvh md:items-center md:justify-center overflow-hidden"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {/* Aurora background accents */}
          <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#a78bfa]/10 blur-[110px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative w-full max-w-[420px] mx-auto flex-1 flex flex-col md:block">
            {/* Mobile brand — bento tile + tagline */}
            <div className="md:hidden flex flex-col items-center text-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center p-2.5 shadow-xl shadow-primary/25">
                <img src={asikonLogo} alt="Asikon" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="font-display text-[22px] font-semibold tracking-tight leading-none">Asikon</h1>
                <p className="text-[12.5px] text-muted-foreground mt-1.5">The future of structured learning.</p>
              </div>
            </div>

            {activeView === "otp" ? (
              <OtpVerification
                email={otpEmail}
                loading={otpLoading}
                error={otpError}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onBack={() => {
                  setActiveView("register");
                  setOtpError(null);
                }}
              />
            ) : activeView === "forgot-password" ? (
              <ForgotPasswordView
                email={forgotEmail}
                setEmail={setForgotEmail}
                error={errors.email}
                loading={loading}
                sent={resetEmailSent}
                onSubmit={handleForgot}
                onBack={() => {
                  setActiveView("login");
                  setResetEmailSent(false);
                  clearErrors();
                }}
                onResend={() => setResetEmailSent(false)}
              />
            ) : (
              <>
                {/* Segmented Sign in / Sign up */}
                <div role="tablist" aria-label="Authentication" className="flex p-1 bg-secondary/70 rounded-2xl mb-6 animate-fade-in">
                  {(["login", "register"] as const).map((v) => (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={activeView === v}
                      type="button"
                      onClick={() => {
                        setActiveView(v);
                        clearErrors();
                      }}
                      className={cn(
                        "flex-1 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200",
                        activeView === v
                          ? "bg-card text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {v === "login" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                {/* Heading */}
                <div className="mb-6 animate-fade-in">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
                    <Sparkles className="h-3 w-3" />
                    {activeView === "login" ? "Pick up where you left off" : "100 coins on signup"}
                  </span>
                  <h2 className="font-display text-[24px] lg:text-[30px] font-semibold tracking-tight leading-[1.1]">
                    {activeView === "login" ? "Welcome back." : "Create your account."}
                  </h2>
                  <p className="text-muted-foreground text-[13.5px] mt-1.5">
                    {activeView === "login"
                      ? "Continue your learning journey with Asikon."
                      : "Build skills with real projects, in minutes."}
                  </p>
                </div>

                {/* OAuth */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <OAuthButton
                    provider="google"
                    loading={oauthLoading === "google"}
                    onClick={() => handleOAuth("google")}
                  />
                  <OAuthButton
                    provider="github"
                    loading={oauthLoading === "github"}
                    onClick={() => handleOAuth("github")}
                  />
                </div>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                    or with email
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Forms */}
                <div key={activeView} className="animate-fade-in">
                  {activeView === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <FloatingField
                        id="login-email"
                        label="Email address"
                        type="email"
                        value={loginEmail}
                        onChange={setLoginEmail}
                        error={errors.email}
                        autoComplete="email"
                        required
                      />
                      <FloatingField
                        id="login-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={setLoginPassword}
                        error={errors.password}
                        autoComplete="current-password"
                        required
                        trailing={
                          <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((s) => !s)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg focus-ring"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <span className="relative">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="peer sr-only"
                            />
                            <span className="block w-4 h-4 rounded-[5px] border border-border bg-background peer-checked:bg-foreground peer-checked:border-foreground transition-colors" />
                            <CheckCircle2
                              className={cn(
                                "absolute inset-0 m-auto h-3 w-3 text-background transition-opacity",
                                rememberMe ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </span>
                          <span className="text-xs text-muted-foreground">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveView("forgot-password");
                            setForgotEmail(loginEmail);
                            clearErrors();
                          }}
                          className="text-xs font-medium text-foreground hover:text-foreground/70 underline-offset-4 hover:underline transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <PrimaryCta loading={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                        {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
                      </PrimaryCta>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FloatingField
                          id="register-username"
                          label="Username"
                          value={registerUsername}
                          onChange={setRegisterUsername}
                          error={errors.username}
                          autoComplete="username"
                          required
                        />
                        <FloatingField
                          id="register-fullname"
                          label="Full name"
                          value={registerFullName}
                          onChange={setRegisterFullName}
                          error={errors.fullName}
                          autoComplete="name"
                        />
                      </div>
                      <FloatingField
                        id="register-email"
                        label="Email address"
                        type="email"
                        value={registerEmail}
                        onChange={setRegisterEmail}
                        error={errors.email}
                        autoComplete="email"
                        required
                      />
                      <FloatingField
                        id="register-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={setRegisterPassword}
                        error={errors.password}
                        autoComplete="new-password"
                        required
                        trailing={
                          <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((s) => !s)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg focus-ring"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      {/* Strength meter */}
                      {registerPassword.length > 0 && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="flex gap-1.5">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1 flex-1 rounded-full transition-colors duration-300",
                                  i < pwScore ? STRENGTH_COLOR[pwScore] : "bg-muted",
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground ml-1">
                            Password strength:{" "}
                            <span className="font-semibold text-foreground">
                              {STRENGTH_LABEL[pwScore]}
                            </span>
                          </p>
                        </div>
                      )}

                      <PrimaryCta loading={loading}>
                        {loading ? "Creating account…" : "Create account"}
                        {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
                      </PrimaryCta>

                      <p className="text-center text-[11px] text-muted-foreground leading-relaxed pt-1">
                        By creating an account you agree to our{" "}
                        <a className="text-foreground/80 underline underline-offset-2 hover:text-primary" href="#">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a className="text-foreground/80 underline underline-offset-2 hover:text-primary" href="#">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </form>
                  )}
                </div>
              </>
            )}

            {/* Bottom-aligned trust strip */}
            {activeView !== "forgot-password" && activeView !== "otp" && (
              <div className="mt-auto pt-8 md:pt-12 space-y-5">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex -space-x-2">
                    {["from-primary to-[#a78bfa]", "from-amber-300 to-rose-400", "from-emerald-400 to-teal-500"].map((g, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 border-background bg-gradient-to-br grid place-items-center text-[10px] font-semibold text-white",
                          g,
                        )}
                      >
                        {["S", "A", "M"][i]}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11.5px] text-center leading-relaxed text-muted-foreground max-w-[260px]">
                    Trusted by <span className="text-foreground font-bold">12,400+</span> learners building real AI skills.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured with bank-grade encryption
                </div>

                {/* Mobile-only value panel (mirrors desktop aside) */}
                <div className="md:hidden pt-2 space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 text-[11.5px] text-muted-foreground rounded-full border border-border bg-card px-3 py-1.5">
                      <Flame className="h-3.5 w-3.5 text-primary" />
                      Pick up where you left off
                    </div>
                  </div>

                  <ul className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl border border-border bg-card/60 backdrop-blur p-4">
                    {[
                      { icon: GraduationCap, title: "Expert courses", sub: "200+ lessons" },
                      { icon: Sparkles, title: "AI tutor", sub: "Bangla + English" },
                      { icon: BookOpen, title: "Prompt library", sub: "1,000+ prompts" },
                      { icon: ShieldCheck, title: "Lifetime access", sub: "Yours forever" },
                    ].map((f) => (
                      <li key={f.title} className="flex items-start gap-2.5">
                        <f.icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <div>
                          <p className="text-[12.5px] font-medium leading-tight text-foreground">
                            {f.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{f.sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <figure className="rounded-2xl border border-border bg-card/60 backdrop-blur p-4">
                    <blockquote className="text-[13px] text-foreground/90 leading-relaxed">
                      "The AI tutor answered my doubts at 2 a.m. before exams.
                      Asikon doesn't just teach — it learns with you."
                    </blockquote>
                    <figcaption className="flex items-center gap-2.5 mt-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-[#a78bfa] grid place-items-center text-[11px] font-semibold text-white">
                        S
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-foreground">Sadia R.</p>
                        <p className="text-[10.5px] text-muted-foreground">
                          ML Engineer · Class of 2025
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

// ---- Sub-components -------------------------------------------------------
function PrimaryCta({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading}
      className="w-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {children}
    </Button>
  );
}

function OAuthButton({
  provider,
  loading,
  onClick,
}: {
  provider: "google" | "github";
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "group relative h-11 rounded-xl border border-border bg-card/80 backdrop-blur",
        "hover:bg-secondary/60 hover:border-foreground/20 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5",
        "flex items-center justify-center gap-2 text-sm font-medium text-foreground",
        "transition-all duration-200 active:translate-y-0 active:scale-[0.99]",
        "disabled:opacity-60 disabled:hover:translate-y-0",
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : provider === "google" ? (
        <GoogleIcon className="h-4 w-4" />
      ) : (
        <Github className="h-4 w-4" />
      )}
      <span>{provider === "google" ? "Google" : "GitHub"}</span>
    </button>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.6 12 2.6 6.8 2.6 2.6 6.8 2.6 12s4.2 9.4 9.4 9.4c5.4 0 9-3.8 9-9.2 0-.6-.06-1.1-.16-1.6H12z"
      />
    </svg>
  );
}

function ForgotPasswordView({
  email,
  setEmail,
  error,
  loading,
  sent,
  onSubmit,
  onBack,
  onResend,
}: {
  email: string;
  setEmail: (v: string) => void;
  error?: string;
  loading: boolean;
  sent: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResend: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 focus-ring rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>

      {sent ? (
        <div className="py-4 space-y-5">
          <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
            <Mail className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-[26px] font-semibold tracking-tight leading-[1.1]">
              Check your email.
            </h2>
            <p className="text-muted-foreground text-[14px]">
              We sent a reset link to{" "}
              <strong className="text-foreground font-medium">{email}</strong>.
            </p>
          </div>
          <Button variant="outline" onClick={onResend}>
            Send again
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="font-display text-[26px] lg:text-[32px] font-semibold tracking-tight leading-[1.1]">
              Reset your password.
            </h2>
            <p className="text-muted-foreground text-[14px] mt-2">
              Enter your email and we'll send you a secure reset link.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <FloatingField
              id="forgot-email"
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              error={error}
              autoComplete="email"
              required
            />
            <PrimaryCta loading={loading}>
              {loading ? "Sending…" : "Send reset link"}
              {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
            </PrimaryCta>
          </form>
        </>
      )}
    </div>
  );
}

export default Auth;
