import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Bell, Shield, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          <TabsTrigger value="backup" data-testid="tab-backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input
                  id="system-name"
                  defaultValue="ScoutSmart"
                  data-testid="input-system-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  defaultValue="Boy Scouts of the Philippines"
                  data-testid="input-organization"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate Scout UIDs</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate unique IDs for new scouts
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-uid" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require payment proof</Label>
                  <p className="text-sm text-muted-foreground">
                    Make payment proof upload mandatory for registration
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-payment-proof" />
              </div>

              <div className="pt-4">
                <Button data-testid="button-save-general">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure SMS and email notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS alerts for announcements and updates
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-sms" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activity Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminders before activities and events
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-activity-reminders" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enrollment Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when new scouts are registered
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-enrollment-notifications" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sms-sender">SMS Sender Name</Label>
                <Input
                  id="sms-sender"
                  defaultValue="BSP-ScoutSmart"
                  data-testid="input-sms-sender"
                />
              </div>

              <div className="pt-4">
                <Button data-testid="button-save-notifications">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Audit Trail</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all system activities and user actions
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-audit-trail" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin and staff accounts
                  </p>
                </div>
                <Switch data-testid="switch-2fa" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue="30"
                  data-testid="input-session-timeout"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy">Minimum Password Length</Label>
                <Input
                  id="password-policy"
                  type="number"
                  defaultValue="8"
                  data-testid="input-password-length"
                />
              </div>

              <div className="pt-4">
                <Button data-testid="button-save-security">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup Settings
              </CardTitle>
              <CardDescription>
                Configure automatic database backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup database at scheduled intervals
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-backup" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Input
                  id="backup-frequency"
                  defaultValue="Daily at 2:00 AM"
                  data-testid="input-backup-frequency"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention-days">Retention Period (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  defaultValue="30"
                  data-testid="input-retention-days"
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-backup-now">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
                <Button variant="outline" data-testid="button-restore">
                  Restore from Backup
                </Button>
              </div>

              <div className="pt-4">
                <Button data-testid="button-save-backup">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
