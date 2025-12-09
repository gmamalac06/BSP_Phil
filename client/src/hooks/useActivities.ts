import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Activity, InsertActivity } from "@shared/schema";

async function fetchActivities(status?: string): Promise<Activity[]> {
  const url = status ? `/api/activities?status=${status}` : "/api/activities";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  return response.json();
}

async function fetchActivity(id: string): Promise<Activity> {
  const response = await fetch(`/api/activities/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }
  return response.json();
}

async function createActivity(data: InsertActivity): Promise<Activity> {
  const response = await fetch("/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create activity" }));
    console.error("Server error response:", errorData);
    throw new Error(errorData.message || "Failed to create activity");
  }
  return response.json();
}

async function updateActivity(id: string, data: Partial<InsertActivity>): Promise<Activity> {
  const response = await fetch(`/api/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update activity");
  }
  return response.json();
}

async function deleteActivity(id: string): Promise<void> {
  const response = await fetch(`/api/activities/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete activity");
  }
}

export function useActivities(status?: string) {
  return useQuery({
    queryKey: ["activities", status],
    queryFn: () => fetchActivities(status),
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => fetchActivity(id),
    enabled: !!id,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertActivity> }) =>
      updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
