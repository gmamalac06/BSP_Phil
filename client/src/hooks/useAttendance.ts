import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ActivityAttendance, InsertActivityAttendance } from "@shared/schema";

async function fetchActivityAttendance(activityId: string): Promise<ActivityAttendance[]> {
  const response = await fetch(`/api/activities/${activityId}/attendance`);
  if (!response.ok) {
    throw new Error("Failed to fetch activity attendance");
  }
  return response.json();
}

async function fetchScoutAttendance(scoutId: string): Promise<ActivityAttendance[]> {
  const response = await fetch(`/api/scouts/${scoutId}/attendance`);
  if (!response.ok) {
    throw new Error("Failed to fetch scout attendance");
  }
  return response.json();
}

async function markAttendance(
  activityId: string,
  data: { scoutId: string; attended: boolean }
): Promise<ActivityAttendance> {
  const response = await fetch(`/api/activities/${activityId}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to mark attendance");
  }
  return response.json();
}

export function useActivityAttendance(activityId: string) {
  return useQuery({
    queryKey: ["attendance", "activity", activityId],
    queryFn: () => fetchActivityAttendance(activityId),
    enabled: !!activityId,
  });
}

export function useScoutAttendance(scoutId: string) {
  return useQuery({
    queryKey: ["attendance", "scout", scoutId],
    queryFn: () => fetchScoutAttendance(scoutId),
    enabled: !!scoutId,
  });
}

export function useMarkAttendance(activityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { scoutId: string; attended: boolean }) =>
      markAttendance(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "activity", activityId] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}


