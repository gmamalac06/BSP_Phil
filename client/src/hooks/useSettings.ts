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
    queryFn: async (): Promise<Settings[]> => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("category", category)
        .order("key");
      if (error) throw new Error(error.message);
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value, updatedBy }: { key: string; value: string; updatedBy?: string }) => {
      // Find setting by key first
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("key", key)
        .single();

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
      // This would need to be handled via Supabase Edge Functions or manually
      // For now, just return void
      console.log("Settings initialization should be done via Supabase migrations");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
