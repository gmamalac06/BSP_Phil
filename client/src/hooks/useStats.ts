import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalScouts: number;
  activeScouts: number;
  pendingScouts: number;
  upcomingActivities: number;
}

async function fetchStats(): Promise<DashboardStats> {
  const response = await fetch("/api/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
