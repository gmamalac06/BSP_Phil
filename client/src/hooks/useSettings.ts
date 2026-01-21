import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import { settingsService } from "@/lib/supabase-db";
import { supabase } from "@/lib/supabase";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSettingsByCategory(category: string) {
  return useQuery({
    queryKey: ["settings", category],
    queryFn: () => settingsService.getByCategory(category),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value, updatedBy }: { key: string; value: string; updatedBy?: string }) => {
      // Find setting by key first
      const existing = await settingsService.get(key);
      if (!existing) throw new Error("Setting not found");
      return settingsService.update(existing.id, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useInitializeSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return settingsService.initializeDefaultSettings();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
