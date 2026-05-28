import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { panelClass, headlineClass, subheadClass } from "@/components/home/_panel";

type Props = {
  title?: string;
  subtitle?: string;
  variant?: "full" | "slim";
};

export function FinalCta({
  title = "Start your first lesson — free",
  subtitle = "Pick a course, ask the AI, earn 100 welcome coins.",
  variant = "full",
}: Props) {
  if (variant === "slim") {
    return (
      <Reveal as="section" className="section-x">
        <Link
          to="/about"
          className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#f6f5f0] px-4 py-3 transition-colors hover:border-primary/40"
        >
          <span className="font-grotesk text-[13px] font-semibold text-[#0e0e10]">Learn more about ASIKON</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" className="section-x">
      <div className={panelClass}>
        <div className="relative mx-auto max-w-2xl text-center">
          <h3 className={headlineClass}>{title}</h3>
          <p className={subheadClass}>{subtitle}</p>

          <div className="relative mt-5 inline-flex items-center justify-center sm:mt-7">
            <span className="absolute inset-x-2 -bottom-2 h-full rounded-full border border-black/10 bg-white" />
            <span className="absolute inset-x-1 -bottom-1 h-full rounded-full border border-black/10 bg-white" />
            <div className="relative rounded-full border border-black/10 bg-white p-0.5 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.25)] sm:p-1">
              <Link
                to="/shop?type=courses"
                className="relative inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12px] font-extrabold text-primary-foreground shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.03] sm:px-7 sm:py-3 sm:text-[15px]"
              >
                <span aria-hidden>✦</span>
                Browse courses
              </Link>
            </div>
          </div>

          <div className="mt-4 sm:mt-5">
            <Link to="/learn" className="font-grotesk text-[12px] font-semibold text-[#0e0e10] underline-offset-4 hover:underline sm:text-[14px]">
              Try AI tutor →
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
