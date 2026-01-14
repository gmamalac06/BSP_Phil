import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { InsertScout, Scout, Unit, School } from "@shared/schema";
import { scoutsService } from "@/lib/supabase-db";
import { useAuth } from "./useAuth";

export type ScoutWithRelations = Scout & {
  unit: Unit | null;
  school: School | null;
};

export function useScouts(status?: string) {
  const { user, isAdmin, isStaff, isUnitLeader, loading } = useAuth();

  return useQuery<ScoutWithRelations[]>({
    queryKey: ["scouts", status, user?.id],
    queryFn: () => {
      const filters: { status?: string; schoolId?: string; unitId?: string } = { status };

      if (!isAdmin) {
        if (isStaff && user?.schoolId) {
          filters.schoolId = user.schoolId;
        } else if (isUnitLeader && user?.unitId) {
          filters.unitId = user.unitId;
        }
      }

      return scoutsService.getAll(filters) as Promise<ScoutWithRelations[]>;
    },
    enabled: !loading,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertScout> }) =>
      scoutsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteScout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scoutsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
