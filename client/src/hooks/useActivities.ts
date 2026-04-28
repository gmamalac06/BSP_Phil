import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Activity, InsertActivity } from "@shared/schema";
import { activitiesService } from "@/lib/supabase-db";
import { logAudit } from "@/lib/audit";

export function useActivities(status?: string) {
  return useQuery({
    queryKey: ["activities", status],
    queryFn: () => activitiesService.getAll({ status }),
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => activitiesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertActivity) => activitiesService.create(data),
    onSuccess: (created: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      logAudit({
        action: "Activity created",
        details: `Created activity '${(created as any)?.title ?? variables.title}'`,
        category: "create",
      });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertActivity> }) =>
      activitiesService.update(id, data),
    onSuccess: (_data, variables) => {
      logAudit({
        action: "Activity updated",
        details: `Updated activity ${variables.id}`,
        category: "update",
      });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activitiesService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      logAudit({
        action: "Activity deleted",
        details: `Deleted activity ${id}`,
        category: "delete",
      });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
