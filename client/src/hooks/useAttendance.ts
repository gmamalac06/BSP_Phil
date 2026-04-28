import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ActivityAttendance } from "@shared/schema";
import { attendanceService } from "@/lib/supabase-db";
import { supabase } from "@/lib/supabase";
import { logAudit } from "@/lib/audit";

export function useActivityAttendance(activityId: string) {
  return useQuery({
    queryKey: ["attendance", "activity", activityId],
    queryFn: () => attendanceService.getByActivity(activityId),
    enabled: !!activityId,
  });
}

export function useScoutAttendance(scoutId: string) {
  return useQuery({
    queryKey: ["attendance", "scout", scoutId],
    queryFn: async (): Promise<ActivityAttendance[]> => {
      const { data, error } = await supabase
        .from("activity_attendance")
        .select("*, activity:activities(*)")
        .eq("scout_id", scoutId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!scoutId,
  });
}

export function useMarkAttendance(activityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { scoutId: string; attended: boolean }) => {
      // Check if attendance record exists
      const { data: existing } = await supabase
        .from("activity_attendance")
        .select("id")
        .eq("activity_id", activityId)
        .eq("scout_id", data.scoutId)
        .single();

      if (existing) {
        // Update existing record
        const updated = await attendanceService.updateAttendance(existing.id, data.attended);
        return updated;
      } else {
        // Create new record and set attendance
        const created = await attendanceService.register(activityId, data.scoutId);
        if (data.attended) {
          return attendanceService.updateAttendance(created.id, true);
        }
        return created;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "activity", activityId] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      logAudit({
        action: variables.attended ? "Attendance marked present" : "Attendance marked absent",
        details: `Marked scout ${variables.scoutId} as ${variables.attended ? "present" : "absent"} for activity ${activityId}`,
        category: "update",
      });
    },
  });
}
