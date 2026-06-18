import { SITE_URL } from "@/config/site";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { CreateContentFAB } from "@/components/community/CreateContentFAB";
import { CommunityRightRail } from "@/components/community/CommunityRightRail";
import { MyFeedTab } from "@/components/community/tabs/MyFeedTab";
import { PostsTab } from "@/components/community/tabs/PostsTab";
import { VideosTab } from "@/components/community/tabs/VideosTab";
import { ShortsTab } from "@/components/community/tabs/ShortsTab";
import { ReviewsTab } from "@/components/community/tabs/ReviewsTab";
import { OffersTab } from "@/components/community/tabs/OffersTab";
import { CommunityTab } from "@/types/community";
import { MobilePage } from "@/components/layout/MobilePage";

const Community = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>("my-feed");

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-feed": return <MyFeedTab />;
      case "posts": return <PostsTab />;
      case "videos": return <VideosTab />;
      case "shorts": return <ShortsTab />;
      case "reviews": return <ReviewsTab />;
      case "offers": return <OffersTab />;
      default: return <MyFeedTab />;
    }
  };

  return (
    <AppLayout>
      <SEO
        title="Community — Asikon Learners"
        description="Follow learners, share posts, watch videos and read trusted reviews on the Asikon community."
        url={`${SITE_URL}/community`}
      />
      <MobilePage
        sticky={
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:gap-10">
            <div className="lg:max-w-2xl xl:max-w-3xl lg:mx-auto lg:w-full">
              <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        }
        spacing="space-y-4"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:gap-10">
          <main
            data-feed-root
            className="animate-fade-in min-w-0 space-y-4 lg:max-w-2xl xl:max-w-3xl lg:mx-auto lg:w-full"
          >
            {renderTabContent()}
          </main>
          <CommunityRightRail />
        </div>
      </MobilePage>
      <CreateContentFAB />
    </AppLayout>
  );
};

export default Community;
