import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Announcement, InsertAnnouncement } from "@shared/schema";
import { announcementsService } from "@/lib/supabase-db";
import { logAudit } from "@/lib/audit";

export function useAnnouncements(type?: string) {
  return useQuery({
    queryKey: ["announcements", type],
    queryFn: () => announcementsService.getAll({ type }),
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
    onSuccess: (created: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      logAudit({
        action: "Announcement created",
        details: `Created announcement '${(created as any)?.title ?? variables.title}'`,
        category: "create",
      });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertAnnouncement> }) =>
      announcementsService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      logAudit({
        action: "Announcement updated",
        details: `Updated announcement ${variables.id}`,
        category: "update",
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => announcementsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      logAudit({
        action: "Announcement deleted",
        details: `Deleted announcement ${id}`,
        category: "delete",
      });
    },
  });
}
