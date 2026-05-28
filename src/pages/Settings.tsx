import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Lock, Moon, LogOut, ChevronRight, Camera, Shield, Eye, Palette, Coins } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useUserSettings, useUpdateUserSettings, type UserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: settings, isLoading: settingsLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", full_name: "", bio: "" });

  const handleEditProfile = () => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
      });
    }
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast({ title: "Profile updated" });
        setEditMode(false);
      },
      onError: () => toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" }),
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const setSetting = (patch: Partial<UserSettings>) => {
    updateSettings.mutate(patch, {
      onError: () => toast({ title: "Couldn't save", variant: "destructive" }),
    });
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]"><p>Loading...</p></div>
      </AppLayout>
    );
  }
  if (!user) { navigate("/auth"); return null; }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-4 pb-24 max-w-2xl space-y-8">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Account</p>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">Settings</h1>
        </header>

        {/* Profile */}
        <Section icon={User} title="Profile">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-lg">
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                aria-label="Change avatar"
                className="absolute -bottom-1 -right-1 h-7 w-7 grid place-items-center rounded-full bg-foreground text-background border-2 border-card"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[15px] truncate">{profile?.full_name || profile?.username || "User"}</p>
              <p className="text-[12.5px] text-muted-foreground truncate">{user.email}</p>
            </div>
            {!editMode && <Button variant="outline" size="sm" onClick={handleEditProfile}>Edit</Button>}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-[12px] text-muted-foreground font-medium">Username</Label>
                <Input id="username" value={formData.username}
                  onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-[12px] text-muted-foreground font-medium">Full name</Label>
                <Input id="full_name" value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-[12px] text-muted-foreground font-medium">Bio</Label>
                <Input id="bio" value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))} />
              </div>
              <div className="flex gap-2 pt-1">
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving…" : "Save changes"}
                </Button>
                <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60 text-[13.5px]">
              <Row label="Username" value={profile?.username} />
              <Row label="Full name" value={profile?.full_name} />
              <Row label="Bio" value={profile?.bio} />
            </div>
          )}
        </Section>

        {/* Privacy */}
        <Section icon={Shield} title="Privacy">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground font-medium">Profile visibility</Label>
              <Select
                value={settings?.profile_visibility ?? "public"}
                onValueChange={(v) => setSetting({ profile_visibility: v as UserSettings["profile_visibility"] })}
                disabled={settingsLoading}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — anyone can view</SelectItem>
                  <SelectItem value="followers">Followers only</SelectItem>
                  <SelectItem value="private">Private — only you</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground font-medium">Who can message me</Label>
              <Select
                value={settings?.allow_messages_from ?? "everyone"}
                onValueChange={(v) => setSetting({ allow_messages_from: v as UserSettings["allow_messages_from"] })}
                disabled={settingsLoading}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="followers">Followers only</SelectItem>
                  <SelectItem value="none">No one</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="divide-y divide-border/60 -mx-1">
              <ToggleRow
                icon={<Eye className="h-4 w-4 text-foreground/60" />}
                title="Show online status"
                desc="Let others see when you're active"
                checked={settings?.show_online_status ?? true}
                disabled={settingsLoading}
                onChange={(c) => setSetting({ show_online_status: c })}
              />
              <ToggleRow
                title="Show my orders to followers"
                desc="Recent purchases visible on your profile"
                checked={settings?.show_orders_to_followers ?? false}
                disabled={settingsLoading}
                onChange={(c) => setSetting({ show_orders_to_followers: c })}
              />
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <div className="divide-y divide-border/60 -mx-1">
            <ToggleRow title="Order updates" desc="Get notified about your orders"
              checked={settings?.notify_orders ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_orders: c })} />
            <ToggleRow title="Promotions" desc="Receive deals and offers"
              checked={settings?.notify_promotions ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_promotions: c })} />
            <ToggleRow title="Community" desc="Likes and comments on your posts"
              checked={settings?.notify_community ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_community: c })} />
            <ToggleRow title="Messages" desc="New direct messages"
              checked={settings?.notify_messages ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_messages: c })} />
            <ToggleRow title="New followers" desc="When someone follows you"
              checked={settings?.notify_follows ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_follows: c })} />
          </div>
        </Section>

        {/* Appearance & Preferences */}
        <Section icon={Palette} title="Appearance & preferences">
          <div className="divide-y divide-border/60 -mx-1">
            <PrefRow
              icon={<Moon className="h-4 w-4 text-foreground/60" />}
              title="Theme"
              desc="Switch between light and dark"
              control={<ThemeToggle />}
            />
            <PrefRow
              icon={<Coins className="h-4 w-4 text-foreground/60" />}
              title="Currency"
              desc="Display prices in your preferred currency"
              control={<CurrencyToggle />}
            />
          </div>
        </Section>

        {/* Security */}
        <Section icon={Lock} title="Security">
          <button
            onClick={() => navigate("/auth?mode=reset")}
            className="w-full -mx-1 px-1 py-3 flex items-center justify-between hover:bg-secondary/40 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-foreground/60" />
              <span className="text-[14px] font-medium">Change password</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </Section>

        <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>

        <section className="pt-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">About ASIKON</p>
          <MissionVision />
        </section>
      </div>
    </AppLayout>
  );
};

function Section({
  icon: Icon, title, children,
}: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-foreground/60" />
        <h2 className="font-medium text-[14px] tracking-tight">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function PrefRow({
  icon, title, desc, control,
}: { icon?: React.ReactNode; title: string; desc: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-3">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="mt-0.5">{icon}</span>
        <div className="min-w-0">
          <p className="font-medium text-[14px]">{title}</p>
          <p className="text-[12px] text-muted-foreground">{desc}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between py-2.5 gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={value ? "text-foreground text-right truncate" : "text-muted-foreground/60 text-right"}>
        {value || "Not set"}
      </span>
    </div>
  );
}

function ToggleRow({
  icon, title, desc, checked, onChange, disabled,
}: {
  icon?: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-3">
      <div className="flex items-start gap-2.5 min-w-0">
        {icon && <span className="mt-0.5">{icon}</span>}
        <div className="min-w-0">
          <p className="font-medium text-[14px]">{title}</p>
          <p className="text-[12px] text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

export default Settings;
