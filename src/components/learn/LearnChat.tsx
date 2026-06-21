import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Brain,
  ListChecks,
  Sparkles as SparklesIcon,
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
import { SocraticRail } from "@/components/learn/SocraticRail";
import { VoiceInput } from "@/components/learn/VoiceInput";
import { parseSocratic } from "@/lib/socraticParse";
import tutorAvatar from "@/assets/asikon-tutor-avatar.webp";

// AI Elements
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputButton,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const QUICK_PROMPTS = [
  {
    icon: BookOpen,
    label: "I'm stuck on an SSC Math problem",
    prompt: "I'm stuck on an SSC Math problem. Can you help me figure it out step by step? I'll share what I've tried.",
    tint: "from-primary/15 to-primary/0 text-primary ring-primary/20",
  },
  {
    icon: ListChecks,
    label: "Quiz me on photosynthesis",
    prompt: "Give me 5 MCQs on photosynthesis with answers and short explanations.",
    tint: "from-primary/10 to-emerald-500/0 text-primary dark:text-emerald-400 ring-emerald-500/20",
  },
  {
    icon: Brain,
    label: "Walk me through Newton's 2nd law",
    prompt: "I'm trying to understand Newton's second law. Can we go through it together? Ask me what I already know first.",
    tint: "from-primary/10 to-primary/0 text-primary ring-primary/20",
  },
  {
    icon: SparklesIcon,
    label: "Plan my HSC revision",
    prompt: "Build me a realistic 7-day HSC revision routine I can actually follow.",
    tint: "from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  },
];

const CAPABILITIES = [
  { icon: Brain, label: "Guide you through it" },
  { icon: ListChecks, label: "Practice with MCQs" },
  { icon: GraduationCap, label: "Plan your revision" },
];

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

  // Deep-link: /ai-tutor?topic=ssc.physics.motion prefills a starter prompt
  // so the Socratic tutor opens with a focused diagnostic on that topic.
  const prefillRef = useRef(false);
  useEffect(() => {
    if (prefillRef.current) return;
    if (!threadId) return;
    if (initialMessages && initialMessages.length > 0) return;
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    if (topic) {
      const pretty = topic.split(".").pop()?.replace(/-/g, " ") ?? topic;
      setInput(`Tutor me on ${pretty} (topic: ${topic}). Start with a quick diagnostic.`);
      prefillRef.current = true;
    }
  }, [threadId, initialMessages]);

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
    messages: initial as any,
    transport,
    onError: (e) => {
      const msg = (e as Error).message || "";
      if (msg.includes("429")) toast.error("Slow down a sec — try again in a moment.");
      else if (msg.includes("402"))
        toast.error("Out of tutoring credits for today. Try again tomorrow or top up in settings.");
      else toast.error("Something went off — let's try that again.");
    },
  });

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
  const isEmpty = messages.length === 0 && !loadingMsgs;

  const handleSend = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || isBusy) return;
      setInput("");
      void import("@/lib/analytics").then(({ track }) =>
        track("ai_tutor_message", { thread_id: threadId, length: value.length }),
      );
      sendMessage({ text: value });
    },
    [isBusy, sendMessage, threadId],
  );

  const handlePromptSubmit = useCallback(
    (msg: PromptInputMessage) => {
      handleSend(msg.text ?? "");
    },
    [handleSend],
  );

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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="shrink-0 relative flex items-center gap-2 px-3 lg:px-6 h-14 border-b border-border liquid-nav">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back"
            className="h-9 w-9 rounded-full lg:hidden"
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
              className="pointer-events-none absolute inset-0 -m-2 rounded-full blur-md opacity-80"
              style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.35), transparent 70%)" }}
            />
            <img
              src={tutorAvatar}
              alt=""
              className="relative w-8 h-8 rounded-full ring-2 ring-background shadow-sm"
            />
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background"
            />
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold truncate leading-tight tracking-tight">
              {threadTitle}
            </div>
            <div className="text-[11px] text-muted-foreground leading-tight flex items-center gap-1">
              <span className="text-primary dark:text-emerald-400 font-medium">Online</span>
              <span>· Asikon AI tutor</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleNewChat}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
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
              className="h-9 w-9 rounded-full"
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
      {isEmpty ? (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <EmptyState onPick={handleSend} />
        </div>
      ) : (
        <Conversation className="flex-1 min-h-0">
          <ConversationContent className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-4 sm:py-6 gap-6">
            {loadingMsgs ? (
              <TranscriptSkeleton />
            ) : (
              <>
                {messages.map((m, idx) => {
                  const rawText = (m.parts ?? [])
                    .map((p: any) => (p.type === "text" ? p.text : ""))
                    .join("");
                  const isLast = idx === messages.length - 1;
                  const isStreaming =
                    status === "streaming" && isLast && m.role === "assistant";

                  if (m.role === "user") {
                    return (
                      <Message key={m.id} from="user">
                        <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-md whitespace-pre-wrap text-[15px] leading-relaxed">
                          {rawText}
                        </MessageContent>
                      </Message>
                    );
                  }

                  // Parse out the Socratic metadata header from the first line.
                  // During streaming, the header may not have arrived yet — in
                  // that case `meta` is null and `body` is the original text.
                  const { meta, body } = parseSocratic(rawText);

                  return (
                    <Message key={m.id} from="assistant" className="max-w-full">
                      <div className="flex gap-2.5">
                        <img
                          src={tutorAvatar}
                          alt=""
                          className="w-7 h-7 rounded-full shrink-0 mt-0.5 ring-1 ring-border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-muted-foreground mb-0.5">
                            Asikon AI
                          </div>
                          {meta && meta.step && meta.step !== "direct" && (
                            <SocraticRail
                              step={meta.step}
                              hintLevel={meta.hint_level}
                              topicHint={meta.topic_hint}
                            />
                          )}
                          <MessageContent className="text-[15px] leading-relaxed">
                            <MessageResponse>{body || "…"}</MessageResponse>
                            {isStreaming && (
                              <span className="inline-block w-[2px] h-4 align-middle ml-0.5 bg-foreground animate-pulse" />
                            )}
                          </MessageContent>
                          {body && !isStreaming && (
                            <AssistantActions
                              text={body}
                              onRegenerate={
                                isLast && !isBusy ? () => regenerate() : undefined
                              }
                            />
                          )}
                        </div>
                      </div>
                    </Message>
                  );
                })}

                {status === "submitted" && (
                  <div className="flex items-center gap-2.5">
                    <img
                      src={tutorAvatar}
                      alt=""
                      className="w-7 h-7 rounded-full shrink-0 ring-1 ring-border"
                    />
                    <Shimmer className="text-sm font-medium">Asikon AI is thinking…</Shimmer>
                  </div>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton className="bottom-2" />
        </Conversation>
      )}

      {/* Composer */}
      <div
        className="shrink-0 border-t border-border liquid-nav px-3 sm:px-6 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto w-full max-w-3xl space-y-2">
          {!isEmpty && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
              {ACTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput((v) => (v ? `${v} ${chip}` : chip))}
                  className="shrink-0 px-3 py-1 rounded-full border border-border liquid-glass hover:bg-secondary text-[12px] font-medium whitespace-nowrap transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <PromptInput
            onSubmit={handlePromptSubmit}
            className="rounded-2xl border border-border liquid-glass shadow-sm focus-within:border-primary/50 focus-within:shadow-lg focus-within:ring-4 focus-within:ring-primary/10 transition-all"
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Asikon AI anything…"
              className="text-[15px] leading-6"
            />
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputButton
                  type="button"
                  onClick={() =>
                    toast("File attachments coming soon — paste text for now.")
                  }
                  aria-label="Attach (coming soon)"
                  title="Attach (coming soon)"
                >
                  <span className="text-base leading-none">📎</span>
                </PromptInputButton>
                <VoiceInput
                  disabled={isBusy}
                  onTranscript={(t) =>
                    setInput((v) => (v ? `${v} ${t}`.trim() : t))
                  }
                />

              </PromptInputTools>
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
                <PromptInputSubmit
                  status={status}
                  onStop={stop}
                  disabled={!input.trim() && !isBusy}
                />
              </div>
            </PromptInputFooter>
          </PromptInput>

          <p className="text-[11px] text-center text-muted-foreground">
            Asikon AI can make mistakes — double-check important facts.
          </p>
        </div>
      </div>
    </div>
  );
}

function TranscriptSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading conversation">
      <div className="flex justify-end">
        <div className="h-9 w-48 rounded-2xl rounded-br-md bg-foreground/20 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-[70%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[85%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[55%] rounded-md bg-muted animate-pulse" />
      </div>
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
            className="pointer-events-none absolute inset-0 -m-8 rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary)/0.30), transparent 70%)",
            }}
          />
          <img
            src={tutorAvatar}
            alt="Asikon AI"
            className="relative w-20 h-20"
            width={512}
            height={512}
          />
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Online
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-foreground">
          Hi, I'm Asikon AI
        </h1>
        <p className="text-muted-foreground text-[15px] max-w-md leading-relaxed">
          Show me what you've tried — I'll guide you, not just hand over the answer.
          Bangla or English, your call. Tap the mic if you'd rather speak.
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
              className="group relative overflow-hidden flex items-center gap-3 text-left p-3.5 rounded-2xl liquid-glass border border-border hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                  q.tint,
                )}
              />
              <span
                className={cn(
                  "relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ring-1",
                  q.tint,
                )}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="relative text-[14px] font-medium leading-snug flex-1">
                {q.label}
              </span>
              <ArrowUpRight className="relative w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl liquid-glass border border-border"
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

function AssistantActions({
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
