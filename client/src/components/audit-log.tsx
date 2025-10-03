import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
  category: "create" | "update" | "delete" | "login" | "system";
}

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
          {logs.map((log) => (
            <TableRow key={log.id} data-testid={`row-audit-${log.id}`}>
              <TableCell className="font-mono text-xs">
                {format(log.timestamp, "PPpp")}
              </TableCell>
              <TableCell className="font-medium">{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell className="max-w-md truncate">{log.details}</TableCell>
              <TableCell>
                <Badge className={categoryColors[log.category]}>
                  {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
