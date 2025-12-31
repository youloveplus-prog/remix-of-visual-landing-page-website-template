import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  ProfileHeader,
  ProfileStats,
  ProfileBadges,
  ProfileActions,
  ProfileTrustCard,
  ProfileTabs,
  ProfileFeedTab,
  ProfileShopTab,
  ProfileReviewsTab,
  ProfileMediaTab,
  ProfileDesignsTab,
  ProfileActivityTab,
  type ProfileTabType,
} from "@/components/profile";
import { mockUser, mockProducts, mockPosts } from "@/lib/mock-data";

// Extended mock data for profile
const profileData = {
  ...mockUser,
  bio: mockUser.bio || "Fashion enthusiast & style curator",
  isVerified: mockUser.isVerified ?? true,
  location: "New York, USA",
  coverImage: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800",
  posts: 47,
  purchases: 23,
  reviews: 18,
  badges: ["buyer", "creator", "reviewer", "trusted"],
};

// Mock feed posts
const feedPosts = mockPosts.map((post, idx) => ({
  id: post.id,
  content: post.content,
  image: post.image,
  likes: post.likes,
  comments: post.comments,
  shares: post.shares,
  timestamp: post.timestamp,
  product: post.product ? {
    id: post.product.id,
    name: post.product.name,
    price: post.product.price,
    image: post.product.image,
  } : undefined,
}));

// Mock shop products
const shopProducts = mockProducts.map((p, idx) => ({
  id: p.id,
  name: p.name,
  image: p.image,
  price: p.price,
  rating: p.rating || 4.5,
  reviewCount: p.reviews || 0,
  isPurchased: idx % 2 === 0,
  isReviewed: idx % 3 === 0,
  isSold: idx === 0,
}));

// Mock reviews
const mockReviews = [
  {
    id: "1",
    productId: "1",
    productName: "Premium Leather Crossbody",
    productImage: mockProducts[0].image,
    rating: 5,
    title: "Amazing quality!",
    content: "This bag exceeded my expectations. The leather is genuine and the craftsmanship is impeccable. Highly recommend!",
    images: [mockProducts[0].image],
    helpfulCount: 24,
    isVerifiedPurchase: true,
    createdAt: "2 days ago",
  },
  {
    id: "2",
    productId: "2",
    productName: "Classic White Sneakers",
    productImage: mockProducts[1].image,
    rating: 4,
    content: "Great sneakers, very comfortable. Took a bit to break in but worth it.",
    helpfulCount: 12,
    isVerifiedPurchase: true,
    createdAt: "1 week ago",
  },
];

// Mock media
const mockMedia = [
  { id: "1", type: "image" as const, thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", url: "" },
  { id: "2", type: "video" as const, thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400", url: "", duration: 45, viewCount: 1200 },
  { id: "3", type: "image" as const, thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", url: "" },
  { id: "4", type: "short" as const, thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400", url: "", duration: 15, viewCount: 5400 },
  { id: "5", type: "image" as const, thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400", url: "" },
  { id: "6", type: "video" as const, thumbnail: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400", url: "", duration: 120 },
];

// Mock designs
const mockDesigns = [
  { id: "1", title: "Urban Streetwear Collection", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400", salesCount: 45, likes: 234, earnings: 450.00 },
  { id: "2", title: "Minimalist Logo Design", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400", salesCount: 12, likes: 89, earnings: 120.00 },
  { id: "3", title: "Vintage Pattern Pack", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400", salesCount: 28, likes: 156, earnings: 280.00 },
];

// Mock activities
const mockActivities = [
  { id: "1", type: "purchase" as const, title: "Purchased an item", description: "Premium Leather Crossbody", timestamp: "2 hours ago", metadata: { productName: "Premium Leather Crossbody", productImage: mockProducts[0].image } },
  { id: "2", type: "coins" as const, title: "Earned coins", description: "Review bonus reward", timestamp: "5 hours ago", metadata: { amount: 50 } },
  { id: "3", type: "review" as const, title: "Wrote a review", description: "5-star review for Classic White Sneakers", timestamp: "1 day ago", metadata: { productName: "Classic White Sneakers", productImage: mockProducts[1].image } },
  { id: "4", type: "levelup" as const, title: "Level up!", description: "Reached Gold status", timestamp: "3 days ago", metadata: { level: "Gold" } },
  { id: "5", type: "achievement" as const, title: "Achievement unlocked", description: "Top Reviewer badge earned", timestamp: "1 week ago" },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTabType>("feed");

  const handleStatClick = (stat: string) => {
    console.log("Stat clicked:", stat);
    // Could open a modal or navigate to a list
  };

  const handleCreateDesign = () => {
    navigate("/pod/builder");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "feed":
        return <ProfileFeedTab posts={feedPosts} user={profileData} />;
      case "shop":
        return <ProfileShopTab products={shopProducts} isPodCreator={true} />;
      case "reviews":
        return <ProfileReviewsTab reviews={mockReviews} />;
      case "media":
        return <ProfileMediaTab media={mockMedia} />;
      case "designs":
        return (
          <ProfileDesignsTab 
            designs={mockDesigns} 
            isOwnProfile={true}
            onCreateDesign={handleCreateDesign}
          />
        );
      case "activity":
        return <ProfileActivityTab activities={mockActivities} />;
      default:
        return null;
    }
  };

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <ProfileHeader 
          user={profileData}
          onAvatarClick={() => console.log("Avatar clicked")}
        />

        {/* Stats */}
        <ProfileStats
          followers={profileData.followers}
          following={profileData.following}
          posts={profileData.posts}
          purchases={profileData.purchases}
          reviews={profileData.reviews}
          coins={profileData.coins}
          onStatClick={handleStatClick}
        />

        {/* Badges */}
        <ProfileBadges badges={profileData.badges} />

        {/* Action Buttons */}
        <ProfileActions
          isOwnProfile={true}
          onShare={() => console.log("Share profile")}
        />

        {/* Trust Card */}
        <ProfileTrustCard
          trustScore={profileData.trustScore}
          coins={profileData.coins}
          level={profileData.level}
          onViewDetails={() => console.log("View trust details")}
        />

        {/* Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            feed: profileData.posts,
            reviews: profileData.reviews,
            designs: mockDesigns.length,
          }}
        />

        {/* Tab Content */}
        <div className="pb-20">
          {renderTabContent()}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
