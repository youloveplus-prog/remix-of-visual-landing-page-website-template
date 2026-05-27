import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Popular books — covers from Open Library (free, no key)
const BOOKS = [
  { title: "Atomic Habits", cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg" },
  { title: "Deep Work", cover: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg" },
  { title: "Sapiens", cover: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg" },
  { title: "The Pragmatic Programmer", cover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg" },
  { title: "Clean Code", cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg" },
  { title: "Thinking, Fast and Slow", cover: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg" },
  { title: "The Lean Startup", cover: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg" },
  { title: "Hooked", cover: "https://covers.openlibrary.org/b/isbn/9781591847786-L.jpg" },
  { title: "Show Your Work", cover: "https://covers.openlibrary.org/b/isbn/9780761178972-L.jpg" },
];

// Fan slot layout (7 visible). Center index = 3.
const SLOTS = [
  { rot: -28, x: -260, y: 60, scale: 0.85, z: 1 },
  { rot: -18, x: -170, y: 28, scale: 0.9, z: 2 },
  { rot: -8, x: -85, y: 8, scale: 0.95, z: 3 },
  { rot: 0, x: 0, y: -10, scale: 1.08, z: 6 }, // front center
  { rot: 8, x: 85, y: 8, scale: 0.95, z: 3 },
  { rot: 18, x: 170, y: 28, scale: 0.9, z: 2 },
  { rot: 28, x: 260, y: 60, scale: 0.85, z: 1 },
];

const SPRING = { type: "spring" as const, stiffness: 140, damping: 18, mass: 0.9 };

export function MasterpieceShowcase() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOffset((o) => (o + 1) % BOOKS.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Build the seven visible items: assign each a stable book id via wrap index
  const visible = SLOTS.map((slot, i) => {
    const bookIdx = (i + offset) % BOOKS.length;
    return { slot, slotIdx: i, book: BOOKS[bookIdx], key: `book-${bookIdx}` };
  });

  const frontBook = visible[3].book;

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 rounded-3xl mx-2 lg:mx-6 my-8 bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--primary)/0.15)]">
      {/* Brand glow */}
      <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative">
        <h2 className="font-display font-bold text-foreground text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl mx-auto">
          A place to display your{" "}
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.6)] bg-clip-text text-transparent">
            masterpiece.
          </span>
        </h2>

        <div className="relative mt-14 lg:mt-20 h-[280px] sm:h-[360px] lg:h-[440px]">
          {/* Chat bubble left */}
          <div className="absolute left-[10%] sm:left-[18%] top-0 z-30">
            <div className="relative bg-primary text-primary-foreground text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-xl shadow-primary/30">
              @coplin
              <span className="absolute -bottom-1 left-4 w-3 h-3 bg-primary rotate-45" />
            </div>
          </div>
          {/* Chat bubble right — current front book */}
          <div className="absolute right-[8%] sm:right-[16%] top-0 z-30">
            <AnimatePresence mode="wait">
              <motion.div
                key={frontBook.title}
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.75)] text-primary-foreground text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-xl shadow-primary/40 max-w-[180px] truncate"
              >
                {frontBook.title}
                <span className="absolute -bottom-1 right-4 w-3 h-3 bg-primary rotate-45" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {visible.map(({ slot, book, key }) => (
              <motion.div
                key={key}
                layout
                initial={false}
                animate={{
                  x: slot.x,
                  y: slot.y,
                  rotate: slot.rot,
                  scale: slot.scale,
                  zIndex: slot.z,
                }}
                transition={SPRING}
                whileHover={{ scale: slot.scale * 1.15, rotate: 0, y: slot.y - 20, zIndex: 50, transition: { type: "spring", stiffness: 260, damping: 20 } }}
                style={{ zIndex: slot.z }}
                className="absolute w-[120px] h-[170px] sm:w-[160px] sm:h-[220px] lg:w-[200px] lg:h-[270px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/20 bg-gradient-to-br from-primary/10 to-background cursor-pointer"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                />
                {/* subtle gloss */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20" />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-10 lg:mt-14 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Discover the most-loved books on Asikon — fresh picks shuffle to the front every moment.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.8)] text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
            Explore library
          </button>
          <button className="bg-background/80 backdrop-blur text-foreground rounded-full px-6 py-2.5 text-sm font-medium border border-primary/20 hover:border-primary/40 hover:bg-background transition-all">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
}
