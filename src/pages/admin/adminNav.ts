import {
  LayoutDashboard,
  BarChart3,
  Package,
  Tags,
  GraduationCap,
  BookOpen,
  MessagesSquare,
  Users2,
  ShoppingBag,
  Gift,
  Users,
  Bell,
  LayoutGrid,
  Settings as SettingsIcon,
  Image as ImageIcon,
  ScrollText,
  Download,
  Briefcase,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavSection = "Core" | "Content" | "Community" | "Commerce" | "Admin";

export interface AdminNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  end?: boolean;
  section: AdminNavSection;
  badgeKey?: "users" | "pendingOrders" | "notifications";
}

export const adminNavItems: AdminNavItem[] = [
  // Core
  { title: "Overview", url: "/asikonasik", icon: LayoutDashboard, end: true, section: "Core" },
  { title: "Analytics", url: "/asikonasik/analytics", icon: BarChart3, section: "Core", end: true },
  { title: "Legal Analytics", url: "/asikonasik/analytics/legal", icon: ScrollText, section: "Core" },

  // Content
  { title: "Products", url: "/asikonasik/products", icon: Package, section: "Content" },
  { title: "Categories", url: "/asikonasik/categories", icon: Tags, section: "Content" },
  { title: "Tracks", url: "/asikonasik/tracks", icon: GraduationCap, section: "Content" },
  { title: "Lessons", url: "/asikonasik/lessons", icon: BookOpen, section: "Content" },
  { title: "Digital Products", url: "/asikonasik/digital", icon: Download, section: "Content" },
  { title: "Courses", url: "/asikonasik/courses", icon: GraduationCap, section: "Content" },
  { title: "Services", url: "/asikonasik/services", icon: Briefcase, section: "Content" },

  // Community
  { title: "Posts", url: "/asikonasik/community", icon: MessagesSquare, section: "Community" },
  { title: "Mentors", url: "/asikonasik/mentors", icon: Users2, section: "Community" },

  // Commerce
  { title: "Orders", url: "/asikonasik/orders", icon: ShoppingBag, section: "Commerce", badgeKey: "pendingOrders" },
  { title: "Rewards", url: "/asikonasik/rewards", icon: Gift, section: "Commerce" },

  // Admin
  { title: "Users", url: "/asikonasik/users", icon: Users, section: "Admin", badgeKey: "users" },
  { title: "Notifications", url: "/asikonasik/notifications", icon: Bell, section: "Admin", badgeKey: "notifications" },
  { title: "Live Activity", url: "/asikonasik/live-activity", icon: Megaphone, section: "Admin" },
  { title: "Home Sections", url: "/asikonasik/home-sections", icon: LayoutGrid, section: "Admin" },
  { title: "Banners", url: "/asikonasik/banners", icon: ImageIcon, section: "Admin" },
  { title: "Audit Log", url: "/asikonasik/audit-log", icon: ScrollText, section: "Admin" },
  { title: "Settings", url: "/asikonasik/settings", icon: SettingsIcon, section: "Admin" },
];

export const ADMIN_SECTION_ORDER: AdminNavSection[] = [
  "Core",
  "Content",
  "Community",
  "Commerce",
  "Admin",
];
