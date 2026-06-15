// Shared visual tokens for the "ComingSoonTrio" cream-panel design system.
// Used across home page sections to keep a consistent playful card style.

export type Tone = "dark" | "gray" | "primary";

export const TONES: Record<
  Tone,
  { card: string; title: string; sub: string; chip: string }
> = {
  dark: {
    card: "bg-[#111114] text-white",
    title: "text-white",
    sub: "text-white/70",
    chip: "bg-white text-black",
  },
  gray: {
    card: "bg-[#ececec] text-[#111]",
    title: "text-[#0e0e10]",
    sub: "text-[#5b5b62]",
    chip: "bg-white text-black",
  },
  primary: {
    card: "bg-primary text-primary-foreground",
    title: "text-primary-foreground",
    sub: "text-primary-foreground/80",
    chip: "bg-white text-black",
  },
};

export const TONE_CYCLE: Tone[] = ["dark", "gray", "primary"];

export const panelClass =
  "surface-panel relative overflow-hidden rounded-[22px] px-4 pb-6 pt-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:rounded-[32px] sm:px-8 sm:pb-10 sm:pt-10";

export const chipClass =
  "inline-flex w-fit items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-black sm:px-2.5 sm:py-1 sm:text-[11px] dark:bg-white/10 dark:text-foreground";

export const headlineClass =
  "font-grotesk text-[22px] font-black leading-[1.05] tracking-[-0.03em] text-panel-fg sm:text-[40px]";

export const subheadClass =
  "mt-2 text-[12px] text-panel-muted sm:mt-3 sm:text-[15px]";
