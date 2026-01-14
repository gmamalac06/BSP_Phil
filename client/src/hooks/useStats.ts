import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/lib/supabase-db";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => statsService.getDashboardStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
