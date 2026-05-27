import aiTutor from "@/assets/ai-tutor.jpg";
import book from "@/assets/book-hardcover.jpg";
import aiMl from "@/assets/course-ai-ml.jpg";
import python from "@/assets/course-python.jpg";
import prompt from "@/assets/prompt-library.jpg";
import kit from "@/assets/student-kit.jpg";
import hero from "@/assets/learning-hero.svg";

const CARDS = [
  { img: aiTutor, rot: -22, x: -42, y: 30, z: 1, bg: "bg-red-200" },
  { img: book, rot: -14, x: -28, y: 14, z: 2, bg: "bg-blue-200" },
  { img: python, rot: -6, x: -14, y: 4, z: 3, bg: "bg-yellow-300" },
  { img: prompt, rot: 0, x: 0, y: 0, z: 4, bg: "bg-pink-200" },
  { img: aiMl, rot: 8, x: 14, y: 4, z: 3, bg: "bg-orange-200" },
  { img: kit, rot: 16, x: 28, y: 14, z: 2, bg: "bg-red-300" },
  { img: hero, rot: 24, x: 42, y: 30, z: 1, bg: "bg-green-300" },
];

export function MasterpieceShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#f3f1ee] py-16 lg:py-24 rounded-3xl mx-2 lg:mx-6 my-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display font-bold text-foreground text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl mx-auto">
          A place to display your masterpiece.
        </h2>

        {/* Fanned cards */}
        <div className="relative mt-10 lg:mt-14 h-[260px] sm:h-[340px] lg:h-[420px]">
          {/* Chat bubble left */}
          <div className="absolute left-[14%] sm:left-[20%] top-2 sm:top-6 z-20 animate-fade-in">
            <div className="relative bg-blue-500 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
              @coplin
              <span className="absolute -bottom-1 left-4 w-3 h-3 bg-blue-500 rotate-45" />
            </div>
          </div>
          {/* Chat bubble right */}
          <div className="absolute right-[12%] sm:right-[18%] top-2 sm:top-6 z-20 animate-fade-in">
            <div className="relative bg-green-500 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
              @andrea
              <span className="absolute -bottom-1 right-4 w-3 h-3 bg-green-500 rotate-45" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className={`absolute w-[110px] h-[150px] sm:w-[150px] sm:h-[200px] lg:w-[190px] lg:h-[250px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 ${c.bg} transition-transform duration-500 hover:!rotate-0 hover:!translate-y-0 hover:scale-110 hover:z-50`}
                style={{
                  transform: `translate(${c.x * 1.2}%, ${c.y}%) rotate(${c.rot}deg)`,
                  zIndex: c.z,
                }}
              >
                <img src={c.img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 lg:mt-12 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Learners can display their journey, and mentors can discover and guide minds that resonate with them.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
            Join for $9.99/m
          </button>
          <button className="bg-white text-foreground rounded-full px-5 py-2.5 text-sm font-medium border border-black/10 hover:bg-black/5 transition">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
}
