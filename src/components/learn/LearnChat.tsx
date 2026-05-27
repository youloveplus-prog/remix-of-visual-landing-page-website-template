import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  ArrowUp,
  ArrowLeft,
  Square,
  ArrowDown,
  BookOpen,
  Brain,
  ListChecks,
  Sparkles as SparklesIcon,
  Mic,
  Paperclip,
  PanelLeft,
  PenSquare,
  MoreHorizontal,
  Copy,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  Check,
  Share2,
  Trash2,
  GraduationCap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useAiThreadMessages,
  useAiThreads,
  useCreateAiThread,
  useDeleteAiThread,
} from "@/hooks/useAiTutor";
import { useLearnerProgress } from "@/hooks/useLearnerProgress";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreadList } from "@/components/learn/ThreadList";
import tutorAvatar from "@/assets/asikon-tutor-avatar.png";

// Each quick prompt gets a brand-tinted accent so the icon means something.
const QUICK_PROMPTS = [
  {
    icon: BookOpen,
    label: "Help me with SSC Math",
    prompt: "I'm struggling with SSC math. Can you walk me through where to start?",
  },
  {
    icon: ListChecks,
    label: "Quiz me on photosynthesis",
    prompt: "Give me 5 MCQs on photosynthesis with answers and short explanations.",
  },
  {
    icon: Brain,
    label: "Explain Newton's 2nd law",
    prompt: "Explain Newton's second law to me like I'm 12, with one real example.",
  },
  {
    icon: SparklesIcon,
    label: "Plan my HSC revision",
    prompt: "Build me a realistic 7-day HSC revision routine I can actually follow.",
  },
];

const CAPABILITIES = [
  { icon: Brain, label: "Explain any concept" },
  { icon: ListChecks, label: "Practice with MCQs" },
  { icon: GraduationCap, label: "Plan your revision" },
];

// Chips append a real instruction to the next message.
const ACTION_CHIPS = [
  "Explain like I'm 12",
  "In Bangla please",
  "Quiz me on this",
  "Give me an example",
  "TL;DR",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Props {
  threadId: string;
  onBack?: () => void;
}

export function LearnChat({ threadId, onBack }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: initialMessages, isLoading: loadingMsgs } = useAiThreadMessages(threadId);
  const { data: threads = [] } = useAiThreads();
  const createThread = useCreateAiThread();
  const deleteThread = useDeleteAiThread();
  const { awardSession, awardQuiz } = useLearnerProgress();
  const awardedRef = useRef(false);
  const [input, setInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showJump, setShowJump] = useState(false);

  const activeThread = threads.find((t) => t.id === threadId);
  const threadTitle = activeThread?.title ?? "New chat";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${SUPABASE_URL}/functions/v1/ai-tutor-chat`,
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token ?? "";
          return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };
        },
        body: { threadId },
      }),
    [threadId],
  );

  const initial = useMemo<UIMessage[]>(() => {
    if (!initialMessages) return [];
    return initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
    })) as UIMessage[];
  }, [initialMessages]);

  const { messages, sendMessage, status, stop, regenerate } = useChat({
    id: threadId,
    messages: initial,
    transport,
    onError: (e) => {
      const msg = (e as Error).message || "";
      if (msg.includes("429")) toast.error("Slow down a sec — try again in a moment.");
      else if (msg.includes("402"))
        toast.error("Out of tutoring credits for today. Try again tomorrow or top up in settings.");
      else toast.error("Something went off — let's try that again.");
    },
  });

  // Keep transcript pinned to bottom on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJump(distance > 240);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (status !== "streaming") textareaRef.current?.focus();
  }, [status, threadId]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  // Visual viewport handling so the composer rides above the on-screen keyboard
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      document.documentElement.style.setProperty("--app-vh", `${vv.height}px`);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      document.documentElement.style.removeProperty("--app-vh");
    };
  }, []);

  useEffect(() => {
    if (status !== "ready" || awardedRef.current) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const text = (last.parts ?? [])
      .map((p: any) => (p.type === "text" ? p.text : ""))
      .join("");
    if (!text.trim()) return;
    awardedRef.current = true;
    const mcqHits = (text.match(/^\s*(?:[A-Da-d]|[\u0995-\u09BF])[\)\.\u0964]/gm) ?? []).length;
    if (mcqHits >= 3) awardQuiz();
    else awardSession();
  }, [status, messages, awardSession, awardQuiz]);

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  const handleSend = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    setInput("");
    void import("@/lib/analytics").then(({ track }) => track("ai_tutor_message", { thread_id: threadId, length: value.length }));
    sendMessage({ text: value });
  };

  const handleNewChat = async () => {
    const t = await createThread.mutateAsync();
    navigate(`/learn/${t.id}`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/learn/${threadId}`);
      toast.success("Chat link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const handleDelete = async () => {
    if (!activeThread) return;
    await deleteThread.mutateAsync(threadId);
    toast.success("Chat deleted");
    navigate("/learn");
  };

  const jumpToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const voiceComingSoon = () =>
    toast("Voice questions are on the way — text works great for now.");
  const filesComingSoon = () =>
    toast("File attachments coming soon — paste text for now.");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <img src={tutorAvatar} alt="Asikon AI" className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Hi, I'm Asikon AI</h2>
        <p className="text-muted-foreground mb-4">Sign in to start chatting with Asikon AI.</p>
        <a href="/auth"><Button>Sign in</Button></a>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      {/* Header — calm white bar, hairline border */}
      <header className="shrink-0 relative flex items-center gap-2 px-3 lg:px-6 h-14 border-b border-border bg-background/85 backdrop-blur-xl">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back"
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        {/* Mobile thread switcher */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 rounded-full"
              aria-label="Your chats"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-3 border-b border-border">
              <SheetTitle>Your chats</SheetTitle>
            </SheetHeader>
            <ThreadList activeId={threadId} />
          </SheetContent>
        </Sheet>

        {/* Title + persona */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <div className="relative shrink-0">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -m-1.5 rounded-full blur-md opacity-70"
              style={{ background: "radial-gradient(circle, hsl(var(--foreground)/0.12), transparent 70%)" }}
            />
            <img
              src={tutorAvatar}
              alt=""
              className="relative w-7 h-7 rounded-full ring-1 ring-border"
            />
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold truncate leading-tight tracking-tight">{threadTitle}</div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              Asikon AI · your study buddy
            </div>
          </div>
        </div>

        <Button
          onClick={handleNewChat}
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          disabled={createThread.isPending}
          aria-label="Start a new chat"
          title="New chat"
        >
          <PenSquare className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full"
              aria-label="Chat options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth"
      >
        {loadingMsgs ? (
          <TranscriptSkeleton />
        ) : isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState onPick={handleSend} />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-4 sm:py-6 space-y-6">
            {messages.map((m, idx) => (
              <MessageRow
                key={m.id}
                message={m}
                isStreaming={
                  status === "streaming" &&
                  idx === messages.length - 1 &&
                  m.role === "assistant"
                }
                onRegenerate={
                  m.role === "assistant" && idx === messages.length - 1 && !isBusy
                    ? () => regenerate()
                    : undefined
                }
              />
            ))}
            {status === "submitted" && <TypingIndicator />}
            <div className="h-2" />
          </div>
        )}
      </div>

      {/* Jump to latest */}
      {showJump && messages.length > 0 && (
        <button
          onClick={jumpToBottom}
          aria-label="Jump to latest reply"
          className="absolute left-1/2 -translate-x-1/2 bottom-[120px] z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card/95 backdrop-blur border border-border shadow-md hover:bg-card transition-colors animate-fade-in"
        >
          <ArrowDown className="w-3.5 h-3.5" /> Latest
        </button>
      )}

      {/* Composer — calm white surface, hairline border, no gradient wash */}
      <div className="shrink-0 px-3 sm:px-6 pt-2 pb-2 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl space-y-2 my-0 px-0 py-[400px]">
          {/* Action chips */}
          {!isEmpty && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
              {ACTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInput((v) => (v ? `${v} ${chip}` : chip));
                    textareaRef.current?.focus();
                  }}
                  className="shrink-0 px-3 py-1 rounded-full border border-border bg-card hover:bg-secondary text-[12px] font-medium whitespace-nowrap transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Composer card */}
          <div
            className={cn(
              "rounded-2xl border border-border bg-card shadow-sm",
              "focus-within:border-foreground/40 focus-within:shadow-md",
              "transition-[border-color,box-shadow] duration-200 px-3 pt-2 pb-1.5",
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask Asikon AI anything…"
              rows={1}
              className="w-full resize-none bg-transparent outline-none text-[15px] leading-6 placeholder:text-muted-foreground max-h-[200px]"
              autoFocus
              aria-label="Message Asikon AI"
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-0.5">
                <Button
                  onClick={filesComingSoon}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Attach a file — coming soon"
                  title="Attach a file — coming soon"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  onClick={voiceComingSoon}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Voice input — coming soon"
                  title="Voice input — coming soon"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {input.length > 500 && (
                  <span
                    className={cn(
                      "text-[11px] tabular-nums",
                      input.length > 2000 ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {input.length}
                  </span>
                )}
                {isBusy ? (
                  <Button
                    onClick={stop}
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full"
                    aria-label="Stop reply"
                    title="Stop reply"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim()}
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    aria-label="Send message"
                    title="Send"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-center text-muted-foreground pt-1">
            Asikon AI can make mistakes — double-check important facts.
          </p>
        </div>
      </div>
    </div>
  );
}

function TranscriptSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-6 space-y-6" aria-label="Loading conversation">
      <div className="flex justify-end">
        <div className="h-9 w-48 rounded-2xl rounded-br-md bg-foreground/20 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-[70%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[85%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[55%] rounded-md bg-muted animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-[60%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[78%] rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 animate-fade-in" aria-live="polite">
      <img src={tutorAvatar} alt="" className="w-6 h-6 rounded-full shrink-0" />
      <span
        className="text-sm font-medium bg-clip-text text-transparent bg-[linear-gradient(90deg,hsl(var(--muted-foreground)),hsl(var(--foreground)),hsl(var(--muted-foreground)))] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite] motion-reduce:animate-none motion-reduce:text-muted-foreground"
      >
        Asikon AI is thinking…
      </span>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 animate-fade-in">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -m-6 rounded-full blur-3xl opacity-70"
            style={{ background: "radial-gradient(circle, hsl(var(--foreground)/0.10), transparent 70%)" }}
          />
          <img
            src={tutorAvatar}
            alt="Asikon AI"
            className="relative w-20 h-20"
            width={512}
            height={512}
          />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight mb-2 text-foreground">Hi, I'm Asikon AI</h1>
        <p className="text-muted-foreground text-[15px] max-w-md leading-relaxed">
          Stuck on a chapter? Ask me anything — SSC, HSC, Math, Physics, English.
          I'll explain in English or Bangla, whichever helps.
        </p>
      </div>

      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3 px-1">
        Not sure where to start?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {QUICK_PROMPTS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.label}
              onClick={() => onPick(q.prompt)}
              className="group flex items-start gap-3 text-left p-4 rounded-2xl bg-card border border-border hover:border-foreground/30 hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
            >
              <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-secondary text-foreground ring-1 ring-border">
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-[14px] font-medium leading-snug pt-1.5">{q.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2 px-1">
        What I'm good at
      </p>
      <div className="grid grid-cols-3 gap-2">
        {CAPABILITIES.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border"
            >
              <Icon className="w-4 h-4 text-foreground" />
              <span className="text-[11px] font-medium text-center leading-tight text-muted-foreground">
                {c.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10.5px] text-center text-muted-foreground/70 mt-5 tracking-wide">
        Powered by Lovable AI
      </p>
    </div>
  );
}

function MessageActions({
  text,
  onRegenerate,
}: {
  text: string;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("Couldn't copy");
    }
  }, [text]);

  return (
    <div className="flex items-center gap-0.5 -ml-1.5 mt-1.5 opacity-60 hover:opacity-100 transition-opacity">
      <button
        onClick={copy}
        className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Copy reply"
        title="Copy"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-foreground" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Regenerate reply"
          title="Regenerate"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        onClick={() => setVote(vote === "up" ? null : "up")}
        className={cn(
          "h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors",
          vote === "up" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Helpful"
        title="Helpful"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setVote(vote === "down" ? null : "down")}
        className={cn(
          "h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors",
          vote === "down" ? "text-destructive" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Not helpful"
        title="Not helpful"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function MessageRow({
  message,
  isStreaming,
  onRegenerate,
}: {
  message: UIMessage;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}) {
  const isUser = message.role === "user";
  const text = (message.parts ?? [])
    .map((p: any) => (p.type === "text" ? p.text : ""))
    .join("");

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 bg-foreground text-background whitespace-pre-wrap text-[15px] leading-relaxed">{text}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5 animate-fade-in group/msg">
      <img src={tutorAvatar} alt="" className="w-7 h-7 rounded-full shrink-0 mt-0.5 ring-1 ring-border" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-muted-foreground mb-0.5">Asikon AI</div>
        <div
          className={cn(
            "text-foreground text-[15px] leading-relaxed",
            "prose prose-sm dark:prose-invert max-w-none break-words",
            "prose-p:my-2 prose-headings:mt-3 prose-headings:mb-1.5 prose-li:my-0.5",
            "prose-pre:my-2 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-[13px] prose-pre:font-mono prose-pre:bg-secondary prose-pre:border prose-pre:border-border",
            "prose-code:before:content-none prose-code:after:content-none prose-code:break-words",
            "prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-a:break-all",
            "[&_table]:block [&_table]:overflow-x-auto [&_table]:text-xs [&_img]:rounded-lg",
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
              code: ({ className, children, ...props }: any) => {
                const inline = !className;
                return inline ? (
                  <code className="px-1 py-0.5 rounded bg-muted text-foreground text-[0.85em]" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {text || "…"}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-[2px] h-4 align-middle ml-0.5 bg-foreground animate-pulse" />
          )}
        </div>
        {text && !isStreaming && (
          <MessageActions text={text} onRegenerate={onRegenerate} />
        )}
      </div>
    </div>
  );
}
