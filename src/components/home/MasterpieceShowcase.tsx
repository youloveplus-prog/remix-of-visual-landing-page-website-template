import { useEffect, useState } from "react";

// Popular books — covers from Open Library (free, no key)
const BOOKS = [
  { title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", bg: "bg-yellow-300" },
  { title: "Deep Work", author: "Cal Newport", cover: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg", bg: "bg-blue-200" },
  { title: "Sapiens", author: "Yuval Harari", cover: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg", bg: "bg-orange-200" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", cover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg", bg: "bg-pink-200" },
  { title: "Clean Code", author: "Robert Martin", cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg", bg: "bg-red-200" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", cover: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg", bg: "bg-green-300" },
  { title: "The Lean Startup", author: "Eric Ries", cover: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg", bg: "bg-red-300" },
  { title: "Hooked", author: "Nir Eyal", cover: "https://covers.openlibrary.org/b/isbn/9781591847786-L.jpg", bg: "bg-blue-300" },
  { title: "Show Your Work", author: "Austin Kleon", cover: "https://covers.openlibrary.org/b/isbn/9780761178972-L.jpg", bg: "bg-yellow-200" },
];

// Fan layout positions (7 cards visible)
const SLOTS = [
  { rot: -22, x: -42, y: 30, z: 1 },
  { rot: -14, x: -28, y: 14, z: 2 },
  { rot: -6, x: -14, y: 4, z: 3 },
  { rot: 0, x: 0, y: 0, z: 5 }, // center / front
  { rot: 8, x: 14, y: 4, z: 3 },
  { rot: 16, x: 28, y: 14, z: 2 },
  { rot: 24, x: 42, y: 30, z: 1 },
];

export function MasterpieceShowcase() {
  const [offset, setOffset] = useState(0);

  // Shuffle the front book every 2.5s
  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % BOOKS.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const visible = SLOTS.map((slot, i) => ({
    ...slot,
    book: BOOKS[(i + offset) % BOOKS.length],
  }));

  const frontBook = visible[3].book;

  return (
    <section className="relative overflow-hidden bg-[#f3f1ee] py-16 lg:py-24 rounded-3xl mx-2 lg:mx-6 my-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display font-bold text-foreground text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl mx-auto">
          A place to display your masterpiece.
        </h2>

        <div className="relative mt-10 lg:mt-14 h-[260px] sm:h-[340px] lg:h-[420px]">
          {/* Chat bubble left */}
          <div className="absolute left-[14%] sm:left-[20%] top-2 sm:top-6 z-20">
            <div className="relative bg-blue-500 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
              @coplin
              <span className="absolute -bottom-1 left-4 w-3 h-3 bg-blue-500 rotate-45" />
            </div>
          </div>
          {/* Chat bubble right — shows current front book title */}
          <div className="absolute right-[12%] sm:right-[18%] top-2 sm:top-6 z-20">
            <div
              key={frontBook.title}
              className="relative bg-green-500 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-lg animate-fade-in max-w-[160px] truncate"
            >
              {frontBook.title}
              <span className="absolute -bottom-1 right-4 w-3 h-3 bg-green-500 rotate-45" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {visible.map((c, i) => (
              <div
                key={i}
                className={`absolute w-[110px] h-[150px] sm:w-[150px] sm:h-[200px] lg:w-[190px] lg:h-[250px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 ${c.book.bg} transition-all duration-700 ease-out hover:!rotate-0 hover:!translate-y-0 hover:scale-110 hover:z-50`}
                style={{
                  transform: `translate(${c.x * 1.2}%, ${c.y}%) rotate(${c.rot}deg)`,
                  zIndex: c.z,
                }}
              >
                <img
                  src={c.book.cover}
                  alt={c.book.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 lg:mt-12 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Discover the most-loved books on Asikon — fresh picks shuffle to the front every moment.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
            Explore library
          </button>
          <button className="bg-white text-foreground rounded-full px-5 py-2.5 text-sm font-medium border border-black/10 hover:bg-black/5 transition">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
}
