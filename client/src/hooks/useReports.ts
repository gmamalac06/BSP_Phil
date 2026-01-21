import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Report, InsertReport } from "@shared/schema";
import { reportsService } from "@/lib/supabase-db";

export function useReports(category?: string) {
  return useQuery({
    queryKey: ["reports", category],
    queryFn: () => category ? reportsService.getByCategory(category) : reportsService.getAll(),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: async (): Promise<Report> => {
      const reports = await reportsService.getAll();
      const report = reports.find(r => r.id === id);
      if (!report) throw new Error("Report not found");
      return report;
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertReport) => reportsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
