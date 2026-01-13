import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProtectedRoute } from "@/components/protected-route";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Dashboard from "@/pages/dashboard";
import Scouts from "@/pages/scouts";
import Registration from "@/pages/registration";
import Activities from "@/pages/activities";
import Announcements from "@/pages/announcements";
import Reports from "@/pages/reports";
import Units from "@/pages/units";
import Schools from "@/pages/schools";
import AuditTrail from "@/pages/audit";
import UserApprovals from "@/pages/user-approvals";
import Settings from "@/pages/settings";
import Advisors from "@/pages/advisors";
import UnitLeaders from "@/pages/unit-leaders";
import StaffMembers from "@/pages/staff-members";
import MembershipStatus from "@/pages/membership-status";
import CarouselSettings from "@/pages/carousel-settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/scouts">
        {() => (
          <ProtectedRoute>
            <Scouts />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/registration">
        {() => (
          <ProtectedRoute>
            <Registration />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/activities">
        {() => (
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/announcements">
        {() => (
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/reports">
        {() => (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/units">
        {() => (
          <ProtectedRoute>
            <Units />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/schools">
        {() => (
          <ProtectedRoute>
            <Schools />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/advisors">
        {() => (
          <ProtectedRoute>
            <Advisors />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/audit">
        {() => (
          <ProtectedRoute requireAdmin>
            <AuditTrail />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/user-approvals">
        {() => (
          <ProtectedRoute requireAdmin>
            <UserApprovals />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <ProtectedRoute requireAdmin>
            <Settings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/unit-leaders">
        {() => (
          <ProtectedRoute requireAdmin>
            <UnitLeaders />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/staff-members">
        {() => (
          <ProtectedRoute requireAdmin>
            <StaffMembers />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/membership-status">
        {() => (
          <ProtectedRoute>
            <MembershipStatus />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/carousel-settings">
        {() => (
          <ProtectedRoute requireAdmin>
            <CarouselSettings />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(location);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isPublicRoute) {
    return (
      <>
        <Router />
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Router />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
