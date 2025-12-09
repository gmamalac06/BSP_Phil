import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Scout, InsertScout } from "@shared/schema";
import { useAuth } from "./useAuth";

async function fetchScouts(params: { status?: string; schoolId?: string; unitId?: string }): Promise<Scout[]> {
  const queryParams = new URLSearchParams();
  if (params.status && params.status !== "all") queryParams.append("status", params.status);
  if (params.schoolId) queryParams.append("schoolId", params.schoolId);
  if (params.unitId) queryParams.append("unitId", params.unitId);

  const url = `/api/scouts?${queryParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch scouts");
  }
  return response.json();
}

async function fetchScout(id: string): Promise<Scout> {
  const response = await fetch(`/api/scouts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch scout");
  }
  return response.json();
}

async function createScout(data: InsertScout): Promise<Scout> {
  const response = await fetch("/api/scouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create scout");
  }
  return response.json();
}

async function updateScout(id: string, data: Partial<InsertScout>): Promise<Scout> {
  const response = await fetch(`/api/scouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update scout");
  }
  return response.json();
}

async function deleteScout(id: string): Promise<void> {
  const response = await fetch(`/api/scouts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete scout");
  }
}

export function useScouts(status?: string) {
  const { user, isAdmin, isStaff, isUnitLeader, loading } = useAuth();

  return useQuery({
    queryKey: ["scouts", status, user?.id], // Include user ID to refetch when auth changes
    queryFn: () => {
      const filters: { status?: string; schoolId?: string; unitId?: string } = { status };

      if (!isAdmin) {
        if (isStaff && user?.schoolId) {
          filters.schoolId = user.schoolId;
        } else if (isUnitLeader && user?.unitId) {
          filters.unitId = user.unitId;
        }
      }

      return fetchScouts(filters);
    },
    enabled: !loading,
  });
}

export function useScout(id: string) {
  return useQuery({
    queryKey: ["scouts", id],
    queryFn: () => fetchScout(id),
    enabled: !!id,
  });
}

export function useCreateScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createScout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertScout> }) =>
      updateScout(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
