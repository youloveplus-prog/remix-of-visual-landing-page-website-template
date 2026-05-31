import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  BadgeCheck,
  Loader2,
  MapPin,
  LinkIcon,
  CalendarDays,
  ArrowLeft,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCoverGradient } from "@/lib/cover-gradients";

interface ProfileHeaderProps {
  user: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
    coverImage?: string;
    coverGradient?: string | null;
    bio: string;
    isVerified: boolean;
    trustScore: number;
    isOnline?: boolean;
    location?: string | null;
    website?: string | null;
    joinedAt?: string | null;
  };
  isOwnProfile?: boolean;
  onAvatarClick?: () => void;
  onUpdate?: (updates: { avatar_url?: string; cover_url?: string }) => Promise<void> | void;
  onShare?: () => void;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ProfileHeader({
  user,
  isOwnProfile,
  onAvatarClick,
  onUpdate,
  onShare,
}: ProfileHeaderProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  const trustLevel =
    user.trustScore >= 90 ? "Gold" : user.trustScore >= 70 ? "Silver" : user.trustScore >= 40 ? "Bronze" : "New";

  const uploadImage = async (file: File, type: "avatar" | "cover"): Promise<string | null> => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Unsupported file type", description: "JPG, PNG, GIF or WEBP only.", variant: "destructive" });
      return null;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return null;
    }
    const fileName = `${user.id}/${type}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true, contentType: file.type });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    return supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl;
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;
    setUploadingAvatar(true);
    const url = await uploadImage(file, "avatar");
    if (url) {
      await onUpdate?.({ avatar_url: url });
      toast({ title: "Profile photo updated" });
    }
    setUploadingAvatar(false);
    e.target.value = "";
  };

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;
    setUploadingCover(true);
    const url = await uploadImage(file, "cover");
    if (url) {
      await onUpdate?.({ cover_url: url });
      toast({ title: "Cover photo updated" });
    }
    setUploadingCover(false);
    e.target.value = "";
  };

  // Bio: collapse past 3 lines (~180 chars heuristic)
  const bioIsLong = (user.bio || "").length > 180;

  return (
    <header className="relative">
      {/* Cover */}
      <div className="relative h-32 sm:h-44 overflow-hidden">
        {user.coverImage ? (
          <div
            key={user.coverImage}
            className="absolute inset-0 bg-cover bg-center animate-fade-in"
            style={{ backgroundImage: `url(${user.coverImage})` }}
          />
        ) : (
          <div
            key={`gradient-${user.coverGradient ?? "default"}`}
            className="absolute inset-0 animate-fade-in"
            style={{ background: getCoverGradient(user.coverGradient) }}
          />
        )}
        {uploadingCover && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />

        {/* Top-left back (mobile, viewing someone else) */}
        {!isOwnProfile && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="md:hidden absolute top-3 left-3 h-9 w-9 rounded-full bg-background/85 backdrop-blur-md border border-border flex items-center justify-center focus-ring tap"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        {/* Top-right action cluster */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Share profile"
              className="h-9 w-9 rounded-full bg-background/85 backdrop-blur-md border border-border flex items-center justify-center focus-ring tap"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          {isOwnProfile && (
            <>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                aria-label="Change cover photo"
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-background/85 backdrop-blur-md border border-border text-[12px] font-medium focus-ring tap"
              >
                {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{uploadingCover ? "Uploading…" : "Edit cover"}</span>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleCover}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>

      {/* Centered avatar + identity */}
      <div className="flex flex-col items-center px-4 -mt-12 sm:-mt-16 text-center">
        <div className="relative group" onClick={onAvatarClick}>
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background cursor-pointer ring-2 ring-border shadow-xl transition-transform group-hover:scale-[1.02]">
            <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
            <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
          </Avatar>

          {uploadingAvatar && (
            <div className="absolute inset-0 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {user.isOnline && (
            <span
              className="absolute bottom-1.5 right-1.5 flex h-3 w-3"
              aria-label="Online now"
            >
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background" />
            </span>
          )}

          {isOwnProfile && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  avatarInputRef.current?.click();
                }}
                disabled={uploadingAvatar}
                aria-label="Change profile photo"
                className="absolute -bottom-1 right-0 h-9 w-9 rounded-full bg-foreground text-background border-2 border-background flex items-center justify-center focus-ring tap"
              >
                {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatar}
                className="hidden"
              />
            </>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5 min-w-0">
          <h1 className="font-display text-[22px] sm:text-[26px] font-semibold tracking-tight truncate">{user.name}</h1>
          {user.isVerified && (
            <BadgeCheck className="h-5 w-5 text-foreground/70 shrink-0" aria-label="Verified" />
          )}
        </div>
        <p className="text-[13px] text-muted-foreground">@{user.username}</p>

        {/* Trust chip */}
        {user.trustScore > 0 && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`Trust score ${user.trustScore} out of 100, ${trustLevel} tier`}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full gradient-primary-soft border border-primary/20 text-[11px] font-medium text-foreground focus-ring tap"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      trustLevel === "Gold" && "bg-gold",
                      trustLevel === "Silver" && "bg-muted-foreground",
                      trustLevel === "Bronze" && "bg-orange-500",
                      trustLevel === "New" && "bg-primary",
                    )}
                  />
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span className="tabular-nums">
                    {trustLevel} · {user.trustScore}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs max-w-[220px]">
                Trust score reflects verified purchases, helpful reviews, and account history.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {user.bio && (
          <div className="mt-2 max-w-md">
            <p
              className={cn(
                "text-sm text-foreground/90 leading-relaxed whitespace-pre-line",
                !bioExpanded && bioIsLong && "line-clamp-3",
              )}
            >
              {user.bio}
            </p>
            {bioIsLong && (
              <button
                type="button"
                onClick={() => setBioExpanded((v) => !v)}
                className="mt-0.5 text-xs font-medium text-primary hover:underline focus-ring rounded"
              >
                {bioExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {(user.location || user.website || user.joinedAt) && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground max-w-md">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                <span className="truncate max-w-[10rem]">{user.location}</span>
              </span>
            )}
            {user.website && /^https?:\/\//i.test(user.website) && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-foreground hover:underline truncate max-w-[12rem] focus-ring rounded"
              >
                <LinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{user.website.replace(/^https?:\/\/(www\.)?/i, "")}</span>
              </a>
            )}
            {user.joinedAt && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <span>
                  Joined{" "}
                  {new Date(user.joinedAt).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
