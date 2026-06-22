import { homeType } from "@/components/home/typography";

const STATS = [
  { value: "12,400+", label: "Active learners" },
  { value: "850+", label: "Lessons" },
  { value: "120+", label: "Courses & books" },
  { value: "1.2M", label: "Coins earned" },
];

export function LiveStatsBar() {
  return (
    <section className="mt-10 border-y border-white/10">
      <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="px-4 py-6 sm:px-6">
            <div className={homeType.stat}>{s.value}</div>
            <div className={`mt-1 ${homeType.statLabel}`}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
