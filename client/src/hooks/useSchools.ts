import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { School, InsertSchool } from "@shared/schema";
import { schoolsService } from "@/lib/supabase-db";
import { logAudit } from "@/lib/audit";

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
    onSuccess: (created: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      logAudit({
        action: "School created",
        details: `Created school '${(created as any)?.name ?? variables.name}'`,
        category: "create",
      });
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertSchool> }) =>
      schoolsService.update(id, data),
    onSuccess: (_data, variables) => {
      logAudit({
        action: "School updated",
        details: `Updated school ${variables.id}`,
        category: "update",
      });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => schoolsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      logAudit({
        action: "School deleted",
        details: `Deleted school ${id}`,
        category: "delete",
      });
    },
  });
}
