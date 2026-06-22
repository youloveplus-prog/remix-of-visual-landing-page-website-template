/**
 * Seed resources for the /resources page.
 *
 * Static for the first ship — `useResources()` reads from this array.
 * Swap to a Supabase `resources` table later without touching components.
 */

export interface Resource {
  slug: string;
  title: string;
  cover: string;
  category: string;
  tags: string[];
  trending: boolean;
  publishedAt: string; // ISO
  excerpt: string;
  body: string; // simple paragraphs separated by \n\n
  ctaUrl?: string;
}

const u = (id: string, seed: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70&sig=${seed}`;

export const RESOURCES: Resource[] = [
  {
    slug: "ai-tutor-zero-to-flow",
    title: "AI Tutor: Zero to Flow",
    cover: u("1677442136019-21780ecad995", "1"),
    category: "AI Tools",
    tags: ["ai_tools", "productivity", "tutorial"],
    trending: true,
    publishedAt: "2026-06-18T09:00:00Z",
    excerpt: "A 12-minute walkthrough on getting the Asikon AI tutor to answer like your favorite teacher.",
    body: "The AI tutor is at its best when you treat it like a study partner, not a search engine.\n\nStart every session with a one-sentence goal. Tell the tutor what you already know and where you're stuck. Ask for a Socratic check — it will quiz you instead of dumping an answer.\n\nWhen you're ready to move on, ask for a 30-second recap and a flashcard pack. That recap is your revision deck for tomorrow.",
  },
  {
    slug: "prompt-library-deep-dive",
    title: "Prompt Library Deep Dive",
    cover: u("1499951360447-b19be8fe80f5", "2"),
    category: "Prompts",
    tags: ["prompts", "ai_tools", "content_creation"],
    trending: true,
    publishedAt: "2026-06-16T09:00:00Z",
    excerpt: "Twelve hand-tuned prompts that turn the AI tutor into a writing coach, exam mentor, and code reviewer.",
    body: "The Prompt Library ships with 12 patterns we use daily inside Asikon.\n\nEach prompt is a recipe: a role, a constraint, a format, and a self-check. The recipe matters more than the wording — once you learn the four parts, you can adapt any of them to your own subject.\n\nStart with `Code Reviewer (junior friendly)` if you're learning Python. Pair it with `Exam Examiner` the day before a test.",
  },
  {
    slug: "build-a-study-plan-in-five-minutes",
    title: "Build a Study Plan in 5 Minutes",
    cover: u("1503676260728-1c00da094a0b", "3"),
    category: "Tutorial",
    tags: ["productivity", "education", "tutorial"],
    trending: true,
    publishedAt: "2026-06-14T09:00:00Z",
    excerpt: "Hand the AI tutor your syllabus and a deadline — get back a weekly plan calibrated to your schedule.",
    body: "Paste your syllabus into the AI tutor and tell it three things: the exam date, hours per week you can study, and your weakest topic.\n\nThe tutor will return a week-by-week plan that front-loads weak topics and saves the last week for spaced revision.\n\nReview the plan with a senior — Asikon mentors will tighten it for you in 1-on-1 sessions.",
  },
  {
    slug: "mentorship-what-to-ask",
    title: "Mentorship: What to Ask in Your First Session",
    cover: u("1543269865-cbf427effbad", "4"),
    category: "Mentorship",
    tags: ["mentorship", "education", "tutorial"],
    trending: true,
    publishedAt: "2026-06-12T09:00:00Z",
    excerpt: "Three questions that turn a mentor call into a roadmap, not small talk.",
    body: "Your first 1-on-1 with a mentor is short. Spend it on three questions:\n\n1. What does a strong learner at my level look like six months from now?\n2. What's the single highest-leverage habit I'm missing?\n3. What's one resource you'd put on my desk this week?\n\nWrite the answers down. Re-read them before your next session.",
  },
  {
    slug: "spaced-revision-without-burnout",
    title: "Spaced Revision Without the Burnout",
    cover: u("1456513080510-7bf3a84b82f8", "5"),
    category: "Education",
    tags: ["education", "productivity", "research"],
    trending: true,
    publishedAt: "2026-06-10T09:00:00Z",
    excerpt: "A 4-day cycle that beats cramming on every metric we've measured.",
    body: "Spaced revision works because forgetting is part of learning, not a bug.\n\nThe cycle: Day 1 learn. Day 2 quiz yourself blind. Day 4 quiz again, only the items you missed. Day 7 teach the topic to someone else.\n\nThe AI tutor handles the quizzes if there's no one nearby. The teaching step matters most — skip it and the cycle decays.",
  },
  {
    slug: "free-tools-stack-for-students",
    title: "Our Free Tools Stack for Students",
    cover: u("1517694712202-14dd9538aa97", "6"),
    category: "Free Tools",
    tags: ["free_tools", "ai_tools", "productivity"],
    trending: true,
    publishedAt: "2026-06-08T09:00:00Z",
    excerpt: "Seven free, open-source tools we install on every Asikon learner's laptop.",
    body: "Zero-cost tools are core to Asikon. Here's what we install on day one:\n\nVS Code with the Python extension. Obsidian for notes. Anki for spaced repetition. ffmpeg for any video work. Git plus a free GitHub account. The Asikon AI tutor.\n\nThat's it. No paid subscriptions until you've shipped something real.",
  },
  {
    slug: "writing-better-with-the-ai-tutor",
    title: "Writing Better With the AI Tutor",
    cover: u("1455390582262-044cdead277a", "7"),
    category: "Content",
    tags: ["content_creation", "ai_tools", "tutorial"],
    trending: false,
    publishedAt: "2026-06-06T09:00:00Z",
    excerpt: "Three prompts that turn the tutor into a brutal-honest editor — not a cheerleader.",
    body: "Most AI writing help is too kind. Ask explicitly for the opposite.\n\nUse the prompt: `Read this paragraph as a skeptical editor. Quote the weakest sentence and explain what's vague about it.`\n\nThen ask: `Rewrite the same paragraph in 40 words without losing meaning.` Compare. The shorter version is almost always sharper.",
  },
  {
    slug: "exam-prep-week-template",
    title: "The Exam Prep Week Template",
    cover: u("1434030216411-0b793f4b4173", "8"),
    category: "Education",
    tags: ["education", "exam_prep", "productivity"],
    trending: false,
    publishedAt: "2026-06-04T09:00:00Z",
    excerpt: "Seven days, three sessions a day, one mock exam — copy our template.",
    body: "The week before a major exam is not the time to learn new material.\n\nMon–Wed: timed practice on weak topics. Thu: full mock exam in real conditions. Fri: review wrong answers only. Sat: rest. Sun: light revision + sleep early.\n\nAsk the AI tutor to generate the mock from your syllabus on Wednesday night.",
  },
  {
    slug: "python-for-absolute-beginners",
    title: "Python for Absolute Beginners",
    cover: u("1526374965328-7f61d4dc18c5", "9"),
    category: "Programming",
    tags: ["ai_coding", "education", "tutorial"],
    trending: false,
    publishedAt: "2026-06-02T09:00:00Z",
    excerpt: "Four lessons that take you from `print('hi')` to a working flashcard CLI.",
    body: "Don't start Python from a textbook. Start with a tiny project.\n\nLesson 1: print, input, variables. Lesson 2: lists and a for-loop. Lesson 3: read/write a JSON file. Lesson 4: stitch it together as a CLI flashcard app.\n\nBy the end of week one, you have something you actually use.",
  },
  {
    slug: "design-for-non-designers",
    title: "Design for Non-Designers",
    cover: u("1561070791-2526d30994b8", "10"),
    category: "Design",
    tags: ["design", "content_creation", "tutorial"],
    trending: false,
    publishedAt: "2026-05-30T09:00:00Z",
    excerpt: "Four rules that make any slide, doc, or post look ten times better — no Figma required.",
    body: "You don't need taste to make clean work. You need rules.\n\nOne font family. One accent color. Generous whitespace. Left-aligned text. Apply those four to a slide deck and the result is competitive with most agency work.",
  },
  {
    slug: "research-faster-with-asikon",
    title: "Research Faster With Asikon",
    cover: u("1488190211105-8b0e65b80b4e", "11"),
    category: "Research",
    tags: ["research", "ai_tools", "productivity"],
    trending: false,
    publishedAt: "2026-05-28T09:00:00Z",
    excerpt: "How to turn a 20-tab research session into a one-page brief.",
    body: "Open a fresh tutor thread. Drop your three best links into it. Ask: `Read all three. List the points they agree on, the points they disagree on, and what's missing.`\n\nThat output is your starting brief. Edit it, don't copy it.",
  },
  {
    slug: "go-live-on-community",
    title: "Go Live on Community",
    cover: u("1483691278019-cb7253bee49f", "12"),
    category: "Community",
    tags: ["social_media", "content_creation", "tutorial"],
    trending: false,
    publishedAt: "2026-05-26T09:00:00Z",
    excerpt: "Your first Asikon livestream — what to prep, what to skip.",
    body: "Going live is mostly about momentum. Don't over-prepare.\n\nPick one tight topic. Open with the problem you solved this week. Show one thing on screen. Take two questions. End at the 20-minute mark.\n\nThe more often you stream, the less it matters how any single one goes.",
  },
];

export const RESOURCE_TAGS: string[] = Array.from(
  new Set(RESOURCES.flatMap((r) => r.tags)),
).sort();

export function getResourceBySlug(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
