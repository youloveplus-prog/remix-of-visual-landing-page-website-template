import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ArrowLeft, Plus, Menu } from "lucide-react";
import { LearnChat } from "@/components/learn/LearnChat";
import { ThreadList } from "@/components/learn/ThreadList";
import { useAiThreads, useCreateAiThread } from "@/hooks/useAiTutor";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import tutorAvatar from "@/assets/asikon-tutor-avatar.webp";
import asikonLogo from "@/assets/logo.png";

function StandaloneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {children}
    </div>
  );
}

function TopBar({ onNew, onBack, showMenu }: { onNew?: () => void; onBack: () => void; showMenu?: React.ReactNode }) {
  return (
    <header className="flex items-center gap-2 h-12 px-2 border-b border-border bg-background/80 backdrop-blur-md shrink-0">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back" className="h-9 w-9">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      {showMenu}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold leading-tight truncate">Asikon AI</h1>
      </div>
      {onNew && (
        <Button variant="ghost" size="icon" onClick={onNew} aria-label="New chat" className="h-9 w-9">
          <Plus className="h-5 w-5" />
        </Button>
      )}
    </header>
  );
}

function LearnSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 gap-3">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-3/4 rounded-2xl" />
      <div className="mt-auto">
        <Skeleton className="h-14 w-full rounded-3xl" />
      </div>
    </div>
  );
}

export default function Learn() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: threads, isLoading } = useAiThreads();
  const createThread = useCreateAiThread();

  useEffect(() => {
    if (loading || isLoading || threadId || !user) return;
    if (threads && threads.length > 0) {
      navigate(`/learn/${threads[0].id}`, { replace: true });
    } else if (!createThread.isPending && threads && threads.length === 0) {
      createThread.mutateAsync().then((t) => navigate(`/learn/${t.id}`, { replace: true }));
    }
  }, [threads, threadId, isLoading, loading, user]);

  const handleNew = async () => {
    const t = await createThread.mutateAsync();
    navigate(`/learn/${t.id}`);
  };

  const handleBack = () => navigate("/game");

  if (loading) {
    return (
      <StandaloneShell>
        <SEO title="Asikon AI" description="Chat 24/7 with Asikon AI, your personal AI tutor for SSC, HSC, and beyond." url="https://asikonpro.lovable.app/learn" />
        <TopBar onBack={handleBack} />
        <LearnSkeleton />
      </StandaloneShell>
    );
  }

  if (!user) {
    return (
      <StandaloneShell>
        <SEO title="Asikon AI" description="Chat 24/7 with Asikon AI, your personal AI tutor for SSC, HSC, and beyond." url="https://asikonpro.lovable.app/learn" />
        <TopBar onBack={handleBack} />
        <div className="relative flex-1 min-h-0 overflow-y-auto">
          {/* Ambient brand glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
              style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.25), transparent 70%)" }} />
            <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.18), transparent 70%)" }} />
          </div>

          <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">

            <div className="relative mb-6">
              <span aria-hidden className="absolute inset-0 -m-10 rounded-full blur-3xl opacity-70"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.30), transparent 70%)" }} />
              <div className="relative h-28 w-28 rounded-[28px] bg-gradient-to-br from-primary/15 via-card to-card border border-border shadow-xl grid place-items-center">
                <img src={asikonLogo} alt="Asikon" className="h-16 w-16 object-contain" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Asikon AI · 24/7 tutor
            </span>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              Your study buddy, <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">on demand</span>
            </h1>
            <p className="text-muted-foreground mb-6 text-[15px] leading-relaxed max-w-sm">
              Ask anything — SSC, HSC, Math, Physics, English. Bangla or English, whichever helps.
            </p>

            <Button size="lg" onClick={() => navigate("/auth?redirect=/learn")} className="rounded-full px-6 shadow-lg">
              Sign in to start
            </Button>

            <div className="grid grid-cols-3 gap-2 mt-8 w-full max-w-sm">
              {[
                { label: "Explain", sub: "any concept" },
                { label: "Quiz me", sub: "with MCQs" },
                { label: "Plan", sub: "revision" },
              ].map((c) => (
                <div key={c.label} className="px-3 py-2.5 rounded-xl bg-card/60 backdrop-blur border border-border">
                  <div className="text-[13px] font-semibold leading-tight">{c.label}</div>
                  <div className="text-[10.5px] text-muted-foreground leading-tight mt-0.5">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StandaloneShell>
    );
  }


  return (
    <StandaloneShell>
      <SEO
        title="Asikon AI"
        description="Chat with Asikon AI, your 24/7 AI study buddy on Asikon. Get answers, MCQs, and revision plans in seconds."
        url="https://asikonpro.lovable.app/learn"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Asikon AI",
          description: "24/7 AI study buddy for SSC, HSC, and beyond. Get instant answers, MCQs, and revision plans.",
          provider: { "@type": "Organization", name: "Asikon", sameAs: "https://asikonpro.lovable.app/" },
        })}</script>
      </SEO>
      <div className="flex flex-1 min-h-0">
        <aside className="hidden lg:flex w-64 border-r border-border flex-col">
          <ThreadList activeId={threadId} />
        </aside>
        <div className="relative flex-1 min-w-0 min-h-0">
          {threadId ? (
            <LearnChat key={threadId} threadId={threadId} onBack={handleBack} />
          ) : isLoading ? (
            <LearnSkeleton />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Loading your chat...
            </div>
          )}
        </div>
      </div>
    </StandaloneShell>
  );
}


