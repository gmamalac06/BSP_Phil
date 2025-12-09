import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Unit, InsertUnit } from "@shared/schema";

async function fetchUnits(schoolId?: string, status?: string): Promise<Unit[]> {
  const params = new URLSearchParams();
  if (schoolId) params.append("schoolId", schoolId);
  if (status) params.append("status", status);

  const url = params.toString() ? `/api/units?${params}` : "/api/units";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch units");
  }
  return response.json();
}

async function fetchUnit(id: string): Promise<Unit> {
  const response = await fetch(`/api/units/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch unit");
  }
  return response.json();
}

async function createUnit(data: InsertUnit): Promise<Unit> {
  const response = await fetch("/api/units", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create unit");
  }
  return response.json();
}

async function updateUnit(id: string, data: Partial<InsertUnit>): Promise<Unit> {
  const response = await fetch(`/api/units/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update unit");
  }
  return response.json();
}

async function deleteUnit(id: string): Promise<void> {
  const response = await fetch(`/api/units/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete unit");
  }
}

export function useUnits(schoolId?: string, status?: string) {
  return useQuery({
    queryKey: ["units", schoolId, status],
    queryFn: () => fetchUnits(schoolId, status),
  });
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: ["units", id],
    queryFn: () => fetchUnit(id),
    enabled: !!id,
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertUnit> }) =>
      updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}
