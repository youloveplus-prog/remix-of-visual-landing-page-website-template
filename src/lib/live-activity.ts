// Mock generator for "live" social-proof activity events.
// Used by the home LiveActivityFeed strip and the LiveActivityToaster.

export type LiveActivityKind = "purchase" | "review" | "enroll" | "milestone" | "mentor";

export interface LiveActivity {
  id: string;
  kind: LiveActivityKind;
  name: string;
  location: string;
  item: string;
  rating?: number;
  minutesAgo: number;
}

const NAMES = [
  "Ayesha", "Rahim", "Tanvir", "Nusrat", "Sadia", "Imran", "Mahin", "Farhana",
  "Rakib", "Sumaiya", "Zarif", "Mehedi", "Lamia", "Arif", "Mitu", "Shovon",
  "Priya", "Rohan", "Anika", "Sabbir", "Nila", "Tahsin",
];

const LOCATIONS = [
  "Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Cumilla",
  "Mumbai", "Karachi", "Kuala Lumpur", "Singapore", "Dubai", "London",
];

const COURSES = [
  "AI Foundations", "Python for Beginners", "Prompt Engineering Pro",
  "Build with React", "Data Analytics 101", "Freelance Mastery",
  "ChatGPT for Business", "Career Sprint", "Design Systems",
  "Next.js Crash Course", "1-on-1 Mentorship",
];

const MILESTONES = [
  "completed a 7-day streak",
  "unlocked the Fast Learner badge",
  "leveled up to Coin Hunter",
  "finished their first course",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

let counter = 0;
const uid = () => `live-${Date.now()}-${counter++}`;

export function generateLiveActivity(): LiveActivity {
  const kind = pick<LiveActivityKind>([
    "purchase", "purchase", "review", "enroll", "enroll", "milestone", "mentor",
  ]);
  const base = {
    id: uid(),
    name: pick(NAMES),
    location: pick(LOCATIONS),
    minutesAgo: 1 + Math.floor(Math.random() * 14),
  };
  switch (kind) {
    case "purchase":
      return { ...base, kind, item: pick(COURSES) };
    case "review":
      return { ...base, kind, item: pick(COURSES), rating: 4 + Math.round(Math.random()) };
    case "enroll":
      return { ...base, kind, item: pick(COURSES) };
    case "mentor":
      return { ...base, kind, item: "1-on-1 Mentorship" };
    case "milestone":
      return { ...base, kind, item: pick(MILESTONES) };
  }
}

export function describeActivity(a: LiveActivity): { title: string; description: string } {
  const who = `${a.name} from ${a.location}`;
  switch (a.kind) {
    case "purchase":
      return { title: `${who} just bought`, description: a.item };
    case "review":
      return {
        title: `${who} left a ${a.rating}★ review`,
        description: `on “${a.item}”`,
      };
    case "enroll":
      return { title: `${who} enrolled in`, description: a.item };
    case "mentor":
      return { title: `${who} booked`, description: a.item };
    case "milestone":
      return { title: who, description: a.item };
  }
}

export function activityEmoji(kind: LiveActivityKind): string {
  switch (kind) {
    case "purchase": return "🛒";
    case "review": return "⭐";
    case "enroll": return "🎓";
    case "mentor": return "👩‍🏫";
    case "milestone": return "🏆";
  }
}
