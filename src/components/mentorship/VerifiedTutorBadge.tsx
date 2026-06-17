import { ShieldCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { MentorVerification } from "@/hooks/useTrust";

interface Props {
  verification: MentorVerification | undefined;
  className?: string;
  /** Compact pill (icon only on small screens) */
  compact?: boolean;
}

/**
 * Trust badge shown on mentor cards once an admin has marked the mentor
 * as verified. Tooltip lists which checks have actually been completed.
 */
export function VerifiedTutorBadge({ verification, className, compact }: Props) {
  if (!verification || verification.status !== "verified") return null;

  const dims = [
    verification.id_check && "ID verified",
    verification.qualification_check && "Qualifications checked",
    verification.background_check && "Background checked",
  ].filter(Boolean) as string[];

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide",
              className,
            )}
          >
            <ShieldCheck className="h-3 w-3" />
            <span className={cn(compact && "hidden sm:inline")}>Verified</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          <p className="font-semibold mb-1">Verified by Asikon</p>
          {dims.length > 0 ? (
            <ul className="space-y-0.5">
              {dims.map((d) => (
                <li key={d}>• {d}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Identity confirmed.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
