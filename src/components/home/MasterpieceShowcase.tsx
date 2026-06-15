import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import coverAtomicHabits from "@/assets/cover-atomic-habits.jpg";
import coverDeepWork from "@/assets/cover-deep-work.jpg";
import coverSapiens from "@/assets/cover-sapiens.jpg";
import coverPragmatic from "@/assets/cover-pragmatic.jpg";
import coverCleanCode from "@/assets/cover-clean-code.jpg";
import coverThinkingFastSlow from "@/assets/cover-thinking-fast-slow.jpg";
import coverLeanStartup from "@/assets/cover-lean-startup.jpg";
import coverHooked from "@/assets/cover-hooked.jpg";
import coverShowYourWork from "@/assets/cover-show-your-work.jpg";

const BOOKS = [
  { title: "Atomic Habits", cover: coverAtomicHabits },
  { title: "Deep Work", cover: coverDeepWork },
  { title: "Sapiens", cover: coverSapiens },
  { title: "The Pragmatic Programmer", cover: coverPragmatic },
  { title: "Clean Code", cover: coverCleanCode },
  { title: "Thinking, Fast and Slow", cover: coverThinkingFastSlow },
  { title: "The Lean Startup", cover: coverLeanStartup },
  { title: "Hooked", cover: coverHooked },
  { title: "Show Your Work", cover: coverShowYourWork },
];

// 7 fan slots; center index = 3 (front)
const SLOTS = [
  { rot: -28, x: -280, y: 70, scale: 0.82, z: 1 },
  { rot: -18, x: -185, y: 32, scale: 0.88, z: 2 },
  { rot: -9, x: -92, y: 10, scale: 0.94, z: 3 },
  { rot: 0, x: 0, y: -12, scale: 1.1, z: 6 },
  { rot: 9, x: 92, y: 10, scale: 0.94, z: 3 },
  { rot: 18, x: 185, y: 32, scale: 0.88, z: 2 },
  { rot: 28, x: 280, y: 70, scale: 0.82, z: 1 },
];

const CENTER = 3;
const SPRING = { type: "spring" as const, stiffness: 110, damping: 20, mass: 1 };

export function MasterpieceShowcase() {
  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (hovered !== null) return; // pause auto-shuffle on hover
    const id = setInterval(() => setOffset((o) => (o + 1) % BOOKS.length), 3000);
    return () => clearInterval(id);
  }, [hovered]);

  // Build visible cards; when a slot is hovered, swap it visually with the center slot
  const visible = SLOTS.map((slot, i) => {
    const bookIdx = (i + offset) % BOOKS.length;
    let targetSlot = slot;
    if (hovered !== null) {
      if (i === hovered) targetSlot = SLOTS[CENTER];
      else if (i === CENTER) targetSlot = SLOTS[hovered];
    }
    return { slot: targetSlot, slotIdx: i, book: BOOKS[bookIdx], key: `book-${bookIdx}` };
  });

  const frontIdx = hovered ?? CENTER;
  const frontBook = visible[frontIdx].book;

  return (
    <section className="section-x"><div className="relative overflow-hidden py-10 lg:py-20 rounded-3xl my-4 lg:my-8 bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--primary)/0.15)]">
      <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative">
        <h2 className="font-display font-bold text-foreground text-2xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl mx-auto">
          A place to display your{" "}
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.6)] bg-clip-text text-transparent">
            masterpiece.
          </span>
        </h2>

        <div className="relative mt-8 lg:mt-16 h-[280px] sm:h-[420px] lg:h-[520px]">
          {/* Chat bubble left */}
          <div className="absolute left-[8%] sm:left-[16%] top-0 z-30">
            <div className="relative bg-primary text-primary-foreground text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-xl shadow-primary/30">
              @asikon
              <span className="absolute -bottom-1 left-4 w-3 h-3 bg-primary rotate-45" />
            </div>
          </div>
          {/* Chat bubble right — current front book */}
          <div className="absolute right-[6%] sm:right-[14%] top-0 z-30">
            <AnimatePresence mode="wait">
              <motion.div
                key={frontBook.title}
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.75)] text-primary-foreground text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-xl shadow-primary/40 max-w-[200px] truncate"
              >
                {frontBook.title}
                <span className="absolute -bottom-1 right-4 w-3 h-3 bg-primary rotate-45" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center"
            onMouseLeave={() => setHovered(null)}
          >
            {visible.map(({ slot, slotIdx, book, key }) => (
              <motion.div
                key={key}
                initial={false}
                animate={{
                  x: slot.x,
                  y: slot.y,
                  rotate: slot.rot,
                  scale: slot.scale,
                }}
                transition={SPRING}
                onMouseEnter={() => setHovered(slotIdx)}
                style={{ zIndex: hovered === slotIdx ? 20 : slot.z }}
                className="absolute w-[150px] h-[220px] sm:w-[200px] sm:h-[290px] lg:w-[260px] lg:h-[370px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/20 bg-gradient-to-br from-primary/10 to-background cursor-pointer will-change-transform"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />
                {/* Title bar at bottom of card */}
                <div className="pointer-events-none absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                  <p className="text-white text-[11px] sm:text-xs font-semibold line-clamp-2 text-left">
                    {book.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-6 lg:mt-12 text-muted-foreground text-xs sm:text-base max-w-md mx-auto">
          Discover the most-loved books on Asikon hover any cover to bring it to the front.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button className="bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.8)] text-primary-foreground rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
            Explore library
          </button>
          <button className="bg-background/80 backdrop-blur text-foreground rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border border-primary/20 hover:border-primary/40 hover:bg-background transition-all">
            Read more
          </button>
        </div>

        {/* Trust micro-chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] sm:text-xs text-muted-foreground">
          {/* Removed access/guarantee/tutor chips */}
        </div>
      </div>
    </div></section>

  );
}
