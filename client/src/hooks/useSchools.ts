import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { School, InsertSchool } from "@shared/schema";
import { schoolsService } from "@/lib/supabase-db";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsService.getAll(),
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: ["schools", id],
    queryFn: () => schoolsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertSchool) => schoolsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertSchool> }) =>
      schoolsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => schoolsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}
