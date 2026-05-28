import {
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck,
  Flag,
  Ban,
  Pencil,
  MoreHorizontal,
  Loader2,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileActionsProps {
  isFollowing?: boolean;
  isOwnProfile?: boolean;
  isFollowLoading?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onEditProfile?: () => void;
}

export function ProfileActions({
  isFollowing = false,
  isOwnProfile = false,
  isFollowLoading = false,
  onFollow,
  onMessage,
  onShare,
  onReport,
  onBlock,
  onEditProfile,
}: ProfileActionsProps) {
  if (isOwnProfile) {
    return (
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2">
          <Button
            onClick={onEditProfile}
            className="flex-1 tap"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            aria-label="Settings"
            className="tap"
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            aria-label="Share profile"
            className="tap"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-3">
      <div className="flex items-center gap-2">
        <Button
          onClick={onFollow}
          disabled={isFollowLoading}
          aria-pressed={isFollowing}
          aria-label={isFollowing ? "Unfollow" : "Follow"}
          variant={isFollowing ? "outline" : "default"}
          className="flex-[2] tap"
        >
          {isFollowLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isFollowing ? (
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 tap"
          onClick={onMessage}
          aria-label="Send message"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More options" className="tap">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onReport}>
              <Flag className="h-4 w-4 mr-2" />
              Report User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlock} className="text-destructive focus:text-destructive">
              <Ban className="h-4 w-4 mr-2" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
