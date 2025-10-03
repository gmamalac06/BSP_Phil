import { AuditLogTable } from "@/components/audit-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Filter } from "lucide-react";

export default function AuditTrail() {
  // TODO: Remove mock data
  const logs = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: "Admin User",
      action: "Created Scout",
      details: "Created new scout registration for Juan Dela Cruz (BSP-2024-001234)",
      category: "create" as const,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      user: "Staff User",
      action: "Updated Activity",
      details: "Modified Community Service Day attendance count from 45 to 48",
      category: "update" as const,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      user: "Admin User",
      action: "User Login",
      details: "Successful login from IP 192.168.1.100",
      category: "login" as const,
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      user: "System",
      action: "Database Backup",
      details: "Automated database backup completed successfully",
      category: "system" as const,
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      user: "Staff User",
      action: "Deleted Announcement",
      details: "Deleted outdated announcement 'Summer Camp 2023'",
      category: "delete" as const,
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      user: "Unit Leader",
      action: "Updated Unit",
      details: "Changed Eagle Patrol leader from Rodriguez to Santos",
      category: "update" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Audit Trail</h1>
          <p className="text-muted-foreground">
            Monitor system activities and user actions
          </p>
        </div>
        <Button variant="outline" data-testid="button-export-logs">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search-logs">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-logs"
                  placeholder="Search logs..."
                  className="pl-9"
                  data-testid="input-search-logs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select>
                <SelectTrigger id="user" data-testid="select-user">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admin User</SelectItem>
                  <SelectItem value="staff">Staff User</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Input
                id="date-range"
                type="date"
                data-testid="input-date-range"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <AuditLogTable logs={logs} />
    </div>
  );
}
