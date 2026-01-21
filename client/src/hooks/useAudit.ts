import { useQuery } from "@tanstack/react-query";
import { auditService } from "@/lib/supabase-db";

export function useAuditLogs(userId?: string, category?: string, limit?: number) {
  return useQuery({
    queryKey: ["audit", userId, category, limit],
    queryFn: async () => {
      if (userId) return auditService.getByUser(userId);
      if (category) return auditService.getByCategory(category);
      return auditService.getAll();
    },
  });
}
