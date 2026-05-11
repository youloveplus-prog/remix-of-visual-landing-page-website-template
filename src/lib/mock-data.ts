import { Product, User, Post, Story, Challenge, Category } from "@/types";
import productBag from "@/assets/product-bag.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productJacket from "@/assets/product-jacket.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";
import heroFashion from "@/assets/hero-fashion-1.jpg";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "AI & Machine Learning Masterclass",
    price: 49,
    originalPrice: 120,
    image: productBag,
    brand: "Asikon Academy",
    rating: 4.9,
    reviews: 1842,
    isAuthentic: true,
    isTrending: true,
  },
  {
    id: "2",
    name: "Complete Python for Data Science (Course)",
    price: 39,
    image: productSneakers,
    brand: "Asikon Academy",
    rating: 4.8,
    reviews: 2512,
    isAuthentic: true,
  },
  {
    id: "3",
    name: "Atomic Habits — Hardcover Book",
    price: 18,
    originalPrice: 25,
    image: productJacket,
    brand: "Bestseller",
    rating: 4.9,
    reviews: 9189,
    isAuthentic: true,
  },
  {
    id: "4",
    name: "Student Essentials Kit (Notebook + Stationery)",
    price: 22,
    image: productHoodie,
    brand: "StudyGear",
    rating: 4.7,
    reviews: 467,
    isTrending: true,
  },
];

export const mockUser: User = {
  id: "1",
  name: "Sophia Vance",
  username: "sophia_v",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  isVerified: true,
  followers: 12500,
  following: 210,
  sales: 156,
  trustScore: 98,
  coins: 2450,
  level: "Gold Learner",
  bio: "CS student • AI enthusiast • Sharing my learning journey 📚✨",
};

export const mockStories: Story[] = [
  {
    id: "1",
    user: { ...mockUser, name: "Your Story" },
    thumbnail: mockUser.avatar,
    type: "image",
  },
  {
    id: "2",
    user: { ...mockUser, id: "2", name: "Asikon AI", username: "asikon_ai" },
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop",
    type: "image",
  },
  {
    id: "3",
    user: { ...mockUser, id: "3", name: "Study Daily", username: "studydaily" },
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&h=150&fit=crop",
    type: "video",
  },
  {
    id: "4",
    user: { ...mockUser, id: "4", name: "Top Reads", username: "topreads" },
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=150&h=150&fit=crop",
    type: "image",
  },
  {
    id: "5",
    user: { ...mockUser, id: "5", name: "Tutor Live", username: "tutorlive" },
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop",
    type: "video",
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      ...mockUser,
      name: "Sarah Learns",
      username: "sarah_learns",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    },
    content: "Just finished the AI Masterclass on Asikon — the AI tutor cleared up every doubt I had! 🚀 #learning #ai",
    image: heroFashion,
    likes: 2400,
    comments: 45,
    shares: 12,
    timestamp: "2 hours ago",
    product: mockProducts[0],
  },
  {
    id: "2",
    user: mockUser,
    content: "My weekly study haul: new books + the Python course. Asikon recommended all of these for my goals 📚💫",
    image: productJacket,
    likes: 1850,
    comments: 89,
    shares: 34,
    timestamp: "5 hours ago",
    product: mockProducts[2],
  },
];

export const mockCategories: Category[] = [
  { id: "1", name: "All", icon: "✨" },
  { id: "2", name: "Courses", icon: "🎓" },
  { id: "3", name: "Books", icon: "📚" },
  { id: "4", name: "AI Tutor", icon: "🤖" },
  { id: "5", name: "Stationery", icon: "✏️" },
  { id: "6", name: "Gadgets", icon: "💻" },
];

export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Complete your first lesson",
    description: "Finish a lesson in any course",
    progress: 0,
    total: 1,
    reward: 50,
    icon: "🎓",
  },
  {
    id: "2",
    title: "Ask the AI Tutor 5 times",
    description: "Use the AI tutor to clear your doubts",
    progress: 3,
    total: 5,
    reward: 10,
    icon: "🤖",
  },
  {
    id: "3",
    title: "First Purchase",
    description: "Buy your first course or book",
    progress: 0,
    total: 1,
    reward: 100,
    icon: "🛍️",
  },
];
