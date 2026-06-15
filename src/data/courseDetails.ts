import type { ProgressItem } from "@/components/course-detail/CourseProgressCard";

export interface CourseDetailMock {
  title: string;
  instructorName: string;
  instructorHandle: string;
  instructorAvatar?: string | null;
  rating: number;
  duration: string;
  lessons: number;
  description: string[];
  videoPoster?: string | null;
  progress: { completed: number; total: number; items: ProgressItem[] };
}

const DEFAULT_LESSONS: ProgressItem[] = [
  { id: "1", title: "Understand the Basics", done: true },
  { id: "2", title: "Conduct Research", done: true },
  { id: "3", title: "Learn the UX Design Process", done: true },
  { id: "4", title: "Gain Hands-On Experience", done: false },
  { id: "5", title: "Build Your Portfolio", done: false },
  { id: "6", title: "Get Feedback and Iterate", done: false },
  { id: "7", title: "Stay Updated and Network", done: false },
  { id: "8", title: "Core Principles of UX Design", done: false },
  { id: "9", title: "Key Stages in the UX Design Process", done: false },
  { id: "10", title: "Essential Tools for UX Design", done: false },
  { id: "11", title: "Apply for Jobs or Freelance", done: false },
  { id: "12", title: "Continue Learning", done: false },
];

export function buildCourseDetail(partial?: Partial<CourseDetailMock>): CourseDetailMock {
  return {
    title: partial?.title ?? "UX Design Beginner",
    instructorName: partial?.instructorName ?? "Mr. Milian Deon",
    instructorHandle: partial?.instructorHandle ?? "milandeon_44@lea.com",
    instructorAvatar: partial?.instructorAvatar ?? null,
    rating: partial?.rating ?? 4.3,
    duration: partial?.duration ?? "8 weeks",
    lessons: partial?.lessons ?? DEFAULT_LESSONS.length,
    description: partial?.description ?? [
      "Starting your journey in UX design involves a mix of theoretical knowledge and practical experience. Dive into projects, seek mentorship, and continually refine your skills to become proficient in creating compelling user experiences.",
      "User Experience (UX) Design focuses on creating products that provide meaningful and relevant experiences to users.",
      "This involves the design of the entire process of acquiring and integrating the product, including aspects of branding, design, usability, and function.",
    ],
    videoPoster: partial?.videoPoster ?? null,
    progress: partial?.progress ?? {
      completed: DEFAULT_LESSONS.filter((l) => l.done).length,
      total: DEFAULT_LESSONS.length,
      items: DEFAULT_LESSONS,
    },
  };
}
