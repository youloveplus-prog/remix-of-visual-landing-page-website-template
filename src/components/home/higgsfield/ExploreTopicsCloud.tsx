import { Link } from "react-router-dom";

const TOPICS: { label: string; to: string }[] = [
  { label: "Python", to: "/shop?q=python" },
  { label: "Machine Learning", to: "/shop?q=machine+learning" },
  { label: "Deep Learning", to: "/shop?q=deep+learning" },
  { label: "Prompt Engineering", to: "/prompts" },
  { label: "AI Tutor", to: "/learn" },
  { label: "ChatGPT Mastery", to: "/shop?q=chatgpt" },
  { label: "LangChain", to: "/shop?q=langchain" },
  { label: "RAG", to: "/shop?q=rag" },
  { label: "Web Development", to: "/shop?q=web" },
  { label: "React", to: "/shop?q=react" },
  { label: "Next.js", to: "/shop?q=nextjs" },
  { label: "TypeScript", to: "/shop?q=typescript" },
  { label: "Node.js", to: "/shop?q=node" },
  { label: "SQL & Databases", to: "/shop?q=sql" },
  { label: "Data Science", to: "/shop?q=data+science" },
  { label: "Pandas", to: "/shop?q=pandas" },
  { label: "NumPy", to: "/shop?q=numpy" },
  { label: "Computer Vision", to: "/shop?q=vision" },
  { label: "NLP", to: "/shop?q=nlp" },
  { label: "Generative AI", to: "/shop?q=generative" },
  { label: "Stable Diffusion", to: "/shop?q=stable+diffusion" },
  { label: "MidJourney", to: "/shop?q=midjourney" },
  { label: "AI Agents", to: "/shop?q=agents" },
  { label: "AutoGPT", to: "/shop?q=autogpt" },
  { label: "Fine-tuning", to: "/shop?q=fine+tuning" },
  { label: "Vector DBs", to: "/shop?q=vector" },
  { label: "Math for ML", to: "/shop?q=math" },
  { label: "Statistics", to: "/shop?q=stats" },
  { label: "Linear Algebra", to: "/shop?q=algebra" },
  { label: "Kids Coding", to: "/mentors" },
  { label: "1-on-1 Mentors", to: "/mentors" },
  { label: "Prompt Library", to: "/prompts" },
  { label: "Career Tracks", to: "/shop?type=tracks" },
  { label: "Interview Prep", to: "/shop?q=interview" },
  { label: "Free Resources", to: "/resources" },
  { label: "Community", to: "/community" },
];

export function ExploreTopicsCloud() {
  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px] text-center">
        <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
          Explore more <span className="text-[hsl(var(--hf-accent))]">learning</span> topics
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {TOPICS.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:-translate-y-0.5 hover:border-[hsl(var(--hf-accent))] hover:bg-[hsl(var(--hf-accent))]/10 hover:text-white"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
