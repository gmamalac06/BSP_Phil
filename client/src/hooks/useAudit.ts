import { useQuery } from "@tanstack/react-query";
import type { AuditLog } from "@shared/schema";

async function fetchAuditLogs(
  userId?: string,
  category?: string,
  limit?: number
): Promise<AuditLog[]> {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (category) params.append("category", category);
  if (limit) params.append("limit", limit.toString());

  const url = params.toString() ? `/api/audit?${params}` : "/api/audit";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch audit logs");
  }
  return response.json();
}

export function useAuditLogs(userId?: string, category?: string, limit?: number) {
  return useQuery({
    queryKey: ["audit", userId, category, limit],
    queryFn: () => fetchAuditLogs(userId, category, limit),
  });
}
