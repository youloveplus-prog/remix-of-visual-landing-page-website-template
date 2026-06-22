import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Radio, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const creators = [
  { id: "1", name: "Asikon Academy", username: "asikon_academy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", followers: "84k" },
  { id: "2", name: "Code With Rafi", username: "code_with_rafi", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", followers: "32k" },
  { id: "3", name: "Study Smart BD", username: "studysmart_bd", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", followers: "21k" },
];

const tags = ["#aitutor", "#python", "#hsc", "#freelance", "#ml", "#prompts", "#bangla", "#productivity"];

/**
 * Sticky right rail used on the community page on lg+ screens.
 * Shows creators to follow, trending tags, and a live-now teaser.
 */
export function CommunityRightRail() {
  return (
    <aside className="hidden lg:block w-[320px] shrink-0 space-y-4 self-start sticky" style={{ top: "calc(var(--app-header-h) + 56px + 16px)" }}>
      {/* Creators */}
      <Tile icon={Sparkles} title="Creators to follow">
        <ul className="space-y-3">
          {creators.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/15">
                <AvatarImage src={c.avatar} alt={c.name} />
                <AvatarFallback>{c.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-[13px] truncate">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">@{c.username} · {c.followers}</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 px-3 text-[12px]">
                Follow
              </Button>
            </li>
          ))}
        </ul>
      </Tile>

      {/* Tags */}
      <Tile icon={TrendingUp} title="Trending tags">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Link
              key={t}
              to={`/community?tag=${t.replace("#", "")}`}
              className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-secondary/60 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>
      </Tile>

      {/* Live now */}
      <Tile icon={Radio} title="Live now" accent>
        <Link
          to="/community?tab=live"
          className="group flex items-center gap-3 rounded-xl p-3 -m-1 hover:bg-secondary/40 transition-colors"
        >
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&h=120&fit=crop"
              alt="Live"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute top-1 left-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-destructive text-destructive-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[13px] truncate">AI Tutor Q&A — drop your doubts</p>
            <p className="text-[11px] text-muted-foreground">132 watching now</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </Link>
      </Tile>
    </aside>
  );
}

function Tile({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <header className="flex items-center gap-2 mb-3">
        <Icon className={cn("h-4 w-4", accent ? "text-primary" : "text-foreground/60")} />
        <h3 className="font-medium text-[13px] tracking-tight">{title}</h3>
      </header>
      {children}
    </section>
  );
}
