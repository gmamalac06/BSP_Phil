import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Megaphone,
  FileText,
  Settings,
  Shield,
  School,
  ClipboardList,
  LogOut,
  UserCheck,
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
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth, signOut } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "unit_leader", "scout"],
  },
  {
    title: "Scout Registration",
    url: "/registration",
    icon: UserPlus,
    roles: ["admin", "staff"],
  },
  {
    title: "Scouts",
    url: "/scouts",
    icon: Users,
    roles: ["admin", "staff", "unit_leader"],
  },
  {
    title: "Activities",
    url: "/activities",
    icon: Calendar,
    roles: ["admin", "staff", "unit_leader", "scout"],
  },
  {
    title: "Announcements",
    url: "/announcements",
    icon: Megaphone,
    roles: ["admin", "staff", "unit_leader", "scout"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    roles: ["admin", "staff"],
  },
];

const managementItems = [
  {
    title: "Units",
    url: "/units",
    icon: Shield,
    roles: ["admin", "staff"],
  },
  {
    title: "Schools",
    url: "/schools",
    icon: School,
    roles: ["admin", "staff"],
  },
  {
    title: "User Approvals",
    url: "/user-approvals",
    icon: UserCheck,
    roles: ["admin"],
  },
  {
    title: "Audit Trail",
    url: "/audit",
    icon: ClipboardList,
    roles: ["admin"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const currentRole = user?.role || "user";

  const filterByRole = (items: typeof menuItems) => {
    return items.filter((item) => item.roles.includes(currentRole));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">ScoutSmart</h2>
            <p className="text-xs text-muted-foreground">BSP Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByRole(menuItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentRole === "admin" || currentRole === "staff" ? (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(managementItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {user?.username?.slice(0, 2).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username || "User"}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role || "user"}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
