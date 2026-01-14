import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Announcement, InsertAnnouncement } from "@shared/schema";
import { announcementsService } from "@/lib/supabase-db";

export function useAnnouncements(type?: string) {
  return useQuery({
    queryKey: ["announcements", type],
    queryFn: () => announcementsService.getAll(),
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => announcementsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertAnnouncement) => announcementsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertAnnouncement> }) =>
      announcementsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => announcementsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
