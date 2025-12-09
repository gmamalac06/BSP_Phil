import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Report, InsertReport } from "@shared/schema";

async function fetchReports(category?: string): Promise<Report[]> {
  const url = category ? `/api/reports?category=${category}` : "/api/reports";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }
  return response.json();
}

async function fetchReport(id: string): Promise<Report> {
  const response = await fetch(`/api/reports/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch report");
  }
  return response.json();
}

async function createReport(data: InsertReport): Promise<Report> {
  const response = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create report");
  }
  return response.json();
}

export function useReports(category?: string) {
  return useQuery({
    queryKey: ["reports", category],
    queryFn: () => fetchReports(category),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => fetchReport(id),
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
