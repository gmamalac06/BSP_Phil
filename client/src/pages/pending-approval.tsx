import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, LogOut } from "lucide-react";
import { signOut } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function PendingApproval() {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-100/40 dark:from-green-950/20 dark:to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is awaiting administrator approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            You will be granted access to ScoutSmart once an administrator
            approves your account. Please check back later or contact your
            administrator for assistance.
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
