import { AuditLogTable } from "../audit-log";

export default function AuditLogExample() {
  const mockLogs = [
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
      details: "Modified Community Service Day attendance count",
      category: "update" as const,
    },
  ];

  return (
    <div className="p-8 bg-background">
      <AuditLogTable logs={mockLogs} />
    </div>
  );
}
