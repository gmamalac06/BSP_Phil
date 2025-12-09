import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Bell, Shield, Save, Lock, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSettings, useUpdateSetting, useInitializeSettings } from "@/hooks/useSettings";
import { useAuth, useRequireRole } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Settings as SettingsType } from "@shared/schema";

export default function Settings() {
  const { data: settings = [], isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const initializeSettings = useInitializeSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const canEditSettings = useRequireRole("admin");

  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  const settingsByCategory = useMemo(() => {
    const grouped: Record<string, SettingsType[]> = {
      general: [],
      notifications: [],
      security: [],
      backup: [],
    };

    settings.forEach((setting) => {
      if (grouped[setting.category]) {
        grouped[setting.category].push(setting);
      }
    });

    return grouped;
  }, [settings]);

  const getSettingValue = (key: string) => {
    if (key in localSettings) return localSettings[key];
    const setting = settings.find((s) => s.key === key);
    return setting?.value || "";
  };

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveCategory = async (category: string) => {
    try {
      const categorySettings = settingsByCategory[category];
      const updates = categorySettings.filter(s => s.key in localSettings);
      
      if (updates.length === 0) {
        toast({
          title: "No changes",
          description: "No settings were modified",
        });
        return;
      }

      for (const setting of updates) {
        await updateSetting.mutateAsync({
          key: setting.key,
          value: localSettings[setting.key],
          updatedBy: user?.id,
        });
      }
      
      setLocalSettings({});
      toast({
        title: "Settings saved",
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} settings have been updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to save",
        description: error.message || "An error occurred while saving settings",
        variant: "destructive",
      });
    }
  };

  const handleInitializeSettings = async () => {
    try {
      await initializeSettings.mutateAsync();
      toast({
        title: "Settings initialized",
        description: "Default settings have been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Initialization failed",
        description: error.message || "Failed to initialize default settings",
        variant: "destructive",
      });
    }
  };

  if (!canEditSettings) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access system settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (settings.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings and preferences (Admin Only)
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Settings Found</CardTitle>
            <CardDescription>
              Initialize default settings to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No settings have been configured yet. Click the button below to create default settings for the system.
            </p>
            <Button 
              onClick={handleInitializeSettings}
              disabled={initializeSettings.isPending}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {initializeSettings.isPending ? "Initializing..." : "Initialize Default Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderSetting = (setting: SettingsType) => {
    const value = getSettingValue(setting.key);

    if (setting.type === "boolean") {
      return (
        <div key={setting.key} className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{setting.label}</Label>
            {setting.description && (
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            )}
          </div>
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => handleSettingChange(setting.key, checked.toString())}
            data-testid={`switch-${setting.key}`}
          />
        </div>
      );
    }

    return (
      <div key={setting.key} className="space-y-2">
        <Label htmlFor={setting.key}>{setting.label}</Label>
        {setting.description && (
          <p className="text-sm text-muted-foreground">{setting.description}</p>
        )}
        <Input
          id={setting.key}
          type={setting.type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          data-testid={`input-${setting.key}`}
        />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences (Admin Only)
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
              {settingsByCategory.general.map(renderSetting)}

              <div className="pt-4">
                <Button
                  onClick={() => handleSaveCategory("general")}
                  disabled={updateSetting.isPending}
                  data-testid="button-save-general"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSetting.isPending ? "Saving..." : "Save Changes"}
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
              {settingsByCategory.notifications.map(renderSetting)}

              <div className="pt-4">
                <Button
                  onClick={() => handleSaveCategory("notifications")}
                  disabled={updateSetting.isPending}
                  data-testid="button-save-notifications"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSetting.isPending ? "Saving..." : "Save Changes"}
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
              {settingsByCategory.security.map(renderSetting)}

              <div className="pt-4">
                <Button
                  onClick={() => handleSaveCategory("security")}
                  disabled={updateSetting.isPending}
                  data-testid="button-save-security"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSetting.isPending ? "Saving..." : "Save Changes"}
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
              {settingsByCategory.backup.map(renderSetting)}

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
                <Button
                  onClick={() => handleSaveCategory("backup")}
                  disabled={updateSetting.isPending}
                  data-testid="button-save-backup"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSetting.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
