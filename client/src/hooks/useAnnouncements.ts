import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Announcement, InsertAnnouncement } from "@shared/schema";

async function fetchAnnouncements(type?: string): Promise<Announcement[]> {
  const url = type ? `/api/announcements?type=${type}` : "/api/announcements";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch announcements");
  }
  return response.json();
}

async function fetchAnnouncement(id: string): Promise<Announcement> {
  const response = await fetch(`/api/announcements/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch announcement");
  }
  return response.json();
}

async function createAnnouncement(data: InsertAnnouncement): Promise<Announcement> {
  const response = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create announcement");
  }
  return response.json();
}

async function updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement> {
  const response = await fetch(`/api/announcements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update announcement");
  }
  return response.json();
}

async function deleteAnnouncement(id: string): Promise<void> {
  const response = await fetch(`/api/announcements/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete announcement");
  }
}

export function useAnnouncements(type?: string) {
  return useQuery({
    queryKey: ["announcements", type],
    queryFn: () => fetchAnnouncements(type),
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => fetchAnnouncement(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertAnnouncement> }) =>
      updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
