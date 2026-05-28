import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { RevisionPanel } from "@/components/learn/RevisionPanel";
import { SkillMap } from "@/components/learn/SkillMap";

export default function Revision() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <SEO
        title="Revision — Asikon"
        description="Daily spaced-repetition revision to lock in what you've learned."
        url="https://asikonpro.lovable.app/revision"
      />
      <MobilePage>
        <header className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Daily revision</h1>
        </header>
        <div className="space-y-4">
          <RevisionPanel />
          <SkillMap />
        </div>
      </MobilePage>
    </AppLayout>
  );
}
