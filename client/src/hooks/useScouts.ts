import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { InsertScout, Scout, Unit, School } from "@shared/schema";
import { scoutsService } from "@/lib/supabase-db";
import { useAuth } from "./useAuth";
import { logAudit } from "@/lib/audit";

export type ScoutWithRelations = Scout & {
  unit: Unit | null;
  school: School | null;
};

export function useScouts(status?: string) {
  const { user, isAdmin, loading } = useAuth();

  return useQuery<ScoutWithRelations[]>({
    queryKey: ["scouts", status, user?.id],
    queryFn: () => {
      const filters: { status?: string; schoolId?: string; unitId?: string; email?: string } = { status };

      if (!isAdmin) {
        if (user?.role === "staff") {
          filters.schoolId = user.schoolId || "none";
        } else if (user?.role === "unit_leader") {
          filters.unitId = user.unitId || "none";
        } else if (user?.role === "scout") {
          if (user.email) {
            filters.email = user.email;
          } else {
            filters.schoolId = "none";
          }
        } else {
          filters.schoolId = "none"; // other roles see no scouts by default
        }
      }

      return scoutsService.getAll(filters) as Promise<ScoutWithRelations[]>;
    },
    enabled: !loading,
  });
}

export function usePaginatedScouts(filters: any, page: number = 1, pageSize: number = 10) {
  const { user, isAdmin, loading } = useAuth();

  return useQuery({
    queryKey: ["scouts-paginated", filters, page, pageSize, user?.id],
    queryFn: () => {
      const finalFilters: any = { ...filters };

      if (!isAdmin) {
        if (user?.role === "staff") {
          finalFilters.schoolId = user.schoolId || "none";
        } else if (user?.role === "unit_leader") {
          finalFilters.unitId = user.unitId || "none";
        } else if (user?.role === "scout") {
          if (user.email) {
            finalFilters.email = user.email;
          } else {
            finalFilters.schoolId = "none";
          }
        } else {
          finalFilters.schoolId = "none";
        }
      }

      return scoutsService.getPaginated(page, pageSize, finalFilters) as Promise<{ data: ScoutWithRelations[], count: number }>;
    },
    enabled: !loading,
    placeholderData: keepPreviousData,
  });
}

export function useScout(id: string) {
  return useQuery({
    queryKey: ["scouts", id],
    queryFn: () => scoutsService.getById(id),
    enabled: !!id,
  });
}

export function useScoutByUid(uid: string) {
  return useQuery({
    queryKey: ["scouts", "uid", uid],
    queryFn: () => scoutsService.getByUid(uid),
    enabled: !!uid,
  });
}

export function useCreateScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertScout) => scoutsService.create(data),
    onSuccess: (created: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      logAudit({
        action: "Scout created",
        details: `Created scout '${(created as any)?.name ?? variables.name}' (uid: ${(created as any)?.uid ?? "?"})`,
        category: "create",
      });
    },
  });
}

export function useUpdateScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertScout> }) =>
      scoutsService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      const changedKeys = Object.keys(variables.data || {}).join(", ") || "(no fields)";
      logAudit({
        action: "Scout updated",
        details: `Updated scout ${variables.id} — fields: ${changedKeys}`,
        category: "update",
      });
    },
  });
}

export function useDeleteScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scoutsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      logAudit({
        action: "Scout deleted",
        details: `Deleted scout ${id}`,
        category: "delete",
      });
    },
  });
}
