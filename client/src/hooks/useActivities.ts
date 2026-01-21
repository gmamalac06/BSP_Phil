import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Activity, InsertActivity } from "@shared/schema";
import { activitiesService } from "@/lib/supabase-db";

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
      activitiesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activitiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
