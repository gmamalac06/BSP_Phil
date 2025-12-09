import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";

async function fetchSettings(): Promise<Settings[]> {
  const response = await fetch("/api/settings");
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
}

async function fetchSettingsByCategory(category: string): Promise<Settings[]> {
  const response = await fetch(`/api/settings/${category}`);
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
}

async function updateSetting(key: string, value: string, updatedBy?: string): Promise<Settings> {
  const response = await fetch(`/api/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value, updatedBy }),
  });
  if (!response.ok) throw new Error("Failed to update setting");
  return response.json();
}

async function initializeDefaultSettings(): Promise<void> {
  const response = await fetch("/api/settings/initialize", {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to initialize settings");
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSettingsByCategory(category: string) {
  return useQuery({
    queryKey: ["settings", category],
    queryFn: () => fetchSettingsByCategory(category),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value, updatedBy }: { key: string; value: string; updatedBy?: string }) =>
      updateSetting(key, value, updatedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useInitializeSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeDefaultSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
