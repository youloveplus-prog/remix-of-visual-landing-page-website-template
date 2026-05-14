import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  MessagesSquare,
  Palette,
  ShoppingBag,
  Settings as SettingsIcon,
  ShieldCheck,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminGuard } from "./AdminGuard";
import { useIsAdmin } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

const items = [
  { title: "Overview", url: "/asikonasik", icon: LayoutDashboard, end: true },
  { title: "Users", url: "/asikonasik/users", icon: Users },
  { title: "Products", url: "/asikonasik/products", icon: Package },
  { title: "Categories", url: "/asikonasik/categories", icon: Tags },
  { title: "Orders", url: "/asikonasik/orders", icon: ShoppingBag },
  { title: "Community", url: "/asikonasik/community", icon: MessagesSquare },
  { title: "POD Designs", url: "/asikonasik/pod", icon: Palette },
  { title: "Settings", url: "/asikonasik/settings", icon: SettingsIcon },
];

function AdminSidebar() {
  const { pathname } = useLocation();
  const { isSuperAdmin } = useIsAdmin();

  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-3 pt-4 pb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold leading-tight truncate">asikonasik</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.end)}>
                    <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Shortcut</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Back to app</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 border-b border-border flex items-center px-3 gap-3 sticky top-0 z-10 bg-background/80 backdrop-blur">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <span className="font-semibold">Admin Panel</span>
                <Badge variant="secondary" className="text-[10px]">asikonasik</Badge>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}
