import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/lib/supabase-db";
import { useAuth } from "./useAuth";

export function useStats() {
  const { user, isAdmin, loading } = useAuth();

  return useQuery({
    queryKey: ["stats", user?.id],
    queryFn: () => {
      const filters: { schoolId?: string; unitId?: string; email?: string } = {};

      if (!isAdmin && user) {
        if (user.role === "staff") {
          filters.schoolId = user.schoolId || "none";
        } else if (user.role === "unit_leader") {
          filters.unitId = user.unitId || "none";
        } else if (user.role === "scout") {
          filters.email = user.email || "none";
        } else {
          filters.schoolId = "none";
        }
      }

      return statsService.getDashboardStats(filters);
    },
    enabled: !loading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
