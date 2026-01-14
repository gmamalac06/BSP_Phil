import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Unit, InsertUnit } from "@shared/schema";
import { unitsService } from "@/lib/supabase-db";

export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: () => unitsService.getAll(),
  });
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: ["units", id],
    queryFn: () => unitsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertUnit) => unitsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertUnit> }) =>
      unitsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}
