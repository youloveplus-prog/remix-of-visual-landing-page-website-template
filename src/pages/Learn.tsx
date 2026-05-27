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
import tutorAvatar from "@/assets/asikon-tutor-avatar.png";
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
        <h1 className="text-sm font-semibold leading-tight truncate">Apu · AI Tutor</h1>
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
        <SEO title="Apu · AI Tutor" description="Chat 24/7 with Apu, your personal AI tutor for SSC, HSC, and beyond." url="https://asikonpro.lovable.app/learn" />
        <TopBar onBack={handleBack} />
        <LearnSkeleton />
      </StandaloneShell>
    );
  }

  if (!user) {
    return (
      <StandaloneShell>
        <SEO title="Apu · AI Tutor" description="Chat 24/7 with Apu, your personal AI tutor for SSC, HSC, and beyond." url="https://asikonpro.lovable.app/learn" />
        <TopBar onBack={handleBack} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-6">
            <div className="relative h-28 w-28 rounded-3xl bg-card border border-border grid place-items-center">
              <img src={asikonLogo} alt="Asikon" className="h-16 w-16 object-contain" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">Hi, I'm Apu</h1>
          <p className="text-muted-foreground mb-5 text-[15px]">Sign in to start chatting with Apu — your Asikon AI tutor.</p>
          <Button size="lg" onClick={() => navigate("/auth?redirect=/learn")}>Sign in</Button>
        </div>
      </StandaloneShell>
    );
  }

  const mobileMenu = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Chats" className="h-9 w-9 lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <ThreadList activeId={threadId} />
      </SheetContent>
    </Sheet>
  );

  return (
    <StandaloneShell>
      <SEO
        title="Apu · AI Tutor"
        description="Chat with Apu, your 24/7 AI study buddy on Asikon. Get answers, MCQs, and revision plans in seconds."
        url="https://asikonpro.lovable.app/learn"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Asikon AI Tutor — Apu",
          description: "24/7 AI study buddy for SSC, HSC, and beyond. Get instant answers, MCQs, and revision plans.",
          provider: { "@type": "Organization", name: "Asikon", sameAs: "https://asikonpro.lovable.app/" },
        })}</script>
      </SEO>
      <TopBar onBack={handleBack} onNew={handleNew} showMenu={mobileMenu} />
      <div className="flex flex-1 min-h-0">
        <aside className="hidden lg:flex w-64 border-r border-border flex-col">
          <ThreadList activeId={threadId} />
        </aside>
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {threadId ? (
            <LearnChat key={threadId} threadId={threadId} />
          ) : isLoading ? (
            <LearnSkeleton />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Loading your chat...
            </div>
          )}
        </div>
      </div>
    </StandaloneShell>
  );
}

