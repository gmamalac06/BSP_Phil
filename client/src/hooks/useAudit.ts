import { useQuery } from "@tanstack/react-query";
import { auditService } from "@/lib/supabase-db";

export function useAuditLogs(userId?: string, category?: string, limit?: number) {
  return useQuery({
    queryKey: ["audit", userId, category, limit],
    queryFn: () => auditService.getAll(),
  });
}
