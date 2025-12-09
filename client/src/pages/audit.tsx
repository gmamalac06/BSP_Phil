import { useState, useMemo } from "react";
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
import { Search, Download, Filter, RefreshCw } from "lucide-react";
import { useAuditLogs } from "@/hooks/useAudit";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, generateFilename, formatDateTimeForExport, ExportColumn } from "@/lib/export";

export default function AuditTrail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const { data: logs = [], isLoading, refetch } = useAuditLogs();
  const { toast } = useToast();

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.action.toLowerCase().includes(query) ||
          log.details?.toLowerCase().includes(query) ||
          log.userId?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((log) => log.category === categoryFilter);
    }

    if (userFilter && userFilter !== "all") {
      result = result.filter((log) => log.userId === userFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter((log) => {
        if (!log.createdAt) return false;
        const logDate = new Date(log.createdAt);
        return (
          logDate.getFullYear() === filterDate.getFullYear() &&
          logDate.getMonth() === filterDate.getMonth() &&
          logDate.getDate() === filterDate.getDate()
        );
      });
    }

    return result;
  }, [logs, searchQuery, categoryFilter, userFilter, dateFilter]);

  // Get unique users for the filter dropdown
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    logs.forEach((log) => {
      // Only add non-empty user IDs
      if (log.userId && log.userId.trim() !== "") {
        users.add(log.userId);
      }
    });
    return Array.from(users).sort();
  }, [logs]);

  const handleExportLogs = () => {
    if (filteredLogs.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no audit logs matching your filters.",
        variant: "destructive",
      });
      return;
    }

    const columns: ExportColumn[] = [
      { 
        key: "createdAt", 
        label: "Timestamp",
        format: formatDateTimeForExport
      },
      { key: "userId", label: "User ID" },
      { key: "action", label: "Action" },
      { key: "details", label: "Details" },
      { key: "category", label: "Category" },
      { key: "ipAddress", label: "IP Address" },
    ];

    const prefix = categoryFilter !== "all" ? `audit_${categoryFilter}` : "audit_logs";
    exportToCSV(filteredLogs, columns, generateFilename(prefix));

    toast({
      title: "Export successful",
      description: `Exported ${filteredLogs.length} audit log${filteredLogs.length === 1 ? "" : "s"}`,
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Audit logs have been refreshed",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Audit Trail</h1>
          <p className="text-muted-foreground">
            Monitor system activities and user actions ({filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportLogs}
            disabled={filteredLogs.length === 0}
            data-testid="button-export-logs"
          >
            <Download className="h-4 w-4 mr-2" />
            Export ({filteredLogs.length})
          </Button>
        </div>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger id="user" data-testid="select-user">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.filter(userId => userId && userId.trim() !== "").map((userId) => (
                    <SelectItem key={userId} value={userId}>
                      {userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">Filter by Date</Label>
              <Input
                id="date-range"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                data-testid="input-date-range"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-muted-foreground">Loading audit logs...</div>
        </div>
      ) : (
        <AuditLogTable logs={filteredLogs} />
      )}
    </div>
  );
}
