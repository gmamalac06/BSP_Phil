import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { School, InsertSchool } from "@shared/schema";

async function fetchSchools(): Promise<School[]> {
  const response = await fetch("/api/schools");
  if (!response.ok) {
    throw new Error("Failed to fetch schools");
  }
  return response.json();
}

async function fetchSchool(id: string): Promise<School> {
  const response = await fetch(`/api/schools/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch school");
  }
  return response.json();
}

async function createSchool(data: InsertSchool): Promise<School> {
  const response = await fetch("/api/schools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create school");
  }
  return response.json();
}

async function updateSchool(id: string, data: Partial<InsertSchool>): Promise<School> {
  const response = await fetch(`/api/schools/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update school");
  }
  return response.json();
}

async function deleteSchool(id: string): Promise<void> {
  const response = await fetch(`/api/schools/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete school");
  }
}

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: ["schools", id],
    queryFn: () => fetchSchool(id),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertSchool> }) =>
      updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}
