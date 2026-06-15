import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface Props {
  title: string;
  paragraphs: string[];
}

const TABS = ["Description", "Curriculum", "Reviews"] as const;
type Tab = (typeof TABS)[number];

export function CourseDescription({ title, paragraphs }: Props) {
  const [tab, setTab] = useState<Tab>("Description");
  return (
    <div className="surface-panel-soft rounded-3xl p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold leading-tight">{title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
            {tab}
            <ChevronDown className="w-3.5 h-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {TABS.map((t) => (
              <DropdownMenuItem key={t} onClick={() => setTab(t)}>
                {t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tab === "Description" && (
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {tab !== "Description" && (
        <p className="text-sm text-muted-foreground italic">Coming soon.</p>
      )}
    </div>
  );
}
