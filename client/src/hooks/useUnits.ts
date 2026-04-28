import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Unit, InsertUnit } from "@shared/schema";
import { unitsService } from "@/lib/supabase-db";
import { logAudit } from "@/lib/audit";

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
    onSuccess: (created: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      logAudit({
        action: "Unit created",
        details: `Created unit '${(created as any)?.name ?? variables.name}'`,
        category: "create",
      });
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertUnit> }) =>
      unitsService.update(id, data),
    onSuccess: (_data, variables) => {
      logAudit({
        action: "Unit updated",
        details: `Updated unit ${variables.id}`,
        category: "update",
      });
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      logAudit({
        action: "Unit deleted",
        details: `Deleted unit ${id}`,
        category: "delete",
      });
    },
  });
}
