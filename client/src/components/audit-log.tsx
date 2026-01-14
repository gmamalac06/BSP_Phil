import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { safeFormat } from "@/lib/safe-date";
import type { AuditLog } from "@shared/schema";

interface AuditLogTableProps {
  logs: AuditLog[];
}

const categoryColors = {
  create: "bg-chart-3 text-white",
  update: "bg-chart-1 text-white",
  delete: "bg-destructive text-destructive-foreground",
  login: "bg-chart-2 text-white",
  system: "bg-muted text-muted-foreground",
};

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No audit logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} data-testid={`row-audit-${log.id}`}>
                <TableCell className="font-mono text-xs">
                  {safeFormat((log as any).created_at || log.createdAt, "PPpp", "N/A")}
                </TableCell>
                <TableCell className="font-medium">{log.userId || "System"}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="max-w-md truncate">{log.details || "N/A"}</TableCell>
                <TableCell>
                  <Badge className={categoryColors[log.category as keyof typeof categoryColors] || "bg-muted"}>
                    {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
