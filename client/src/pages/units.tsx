import { useState, useMemo, useEffect } from "react";
import { UnitCard } from "@/components/unit-card";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from "@/hooks/useUnits";
import { UnitFormDialog } from "@/components/unit-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import type { Unit } from "@shared/schema";
import { useLocation } from "wouter";

const ITEMS_PER_PAGE = 15;

export default function Units() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [, setLocation] = useLocation();

  const { data: units = [], isLoading } = useUnits();
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();
  const { toast } = useToast();

  // Reset visible count when search changes - moved from useMemo to useEffect
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  const filteredUnits = useMemo(() => {
    if (!searchQuery) return units;

    const query = searchQuery.toLowerCase();
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.leader?.toLowerCase().includes(query)
    );
  }, [units, searchQuery]);

  const visibleUnits = useMemo(() => {
    return filteredUnits.slice(0, visibleCount);
  }, [filteredUnits, visibleCount]);

  const hasMore = visibleCount < filteredUnits.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleAddUnit = async (data: { name: string; leader: string; schoolId?: string; status: string }) => {
    try {
      await createUnit.mutateAsync(data);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Unit added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add unit",
        variant: "destructive",
      });
    }
  };

  const handleEditUnit = async (data: { name: string; leader: string; schoolId?: string; status: string }) => {
    if (!editingUnit) return;
    try {
      await updateUnit.mutateAsync({ id: editingUnit.id, data });
      setEditingUnit(null);
      toast({
        title: "Success",
        description: "Unit updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update unit",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUnit = async () => {
    if (!deletingUnit) return;
    try {
      await deleteUnit.mutateAsync(deletingUnit.id);
      setDeletingUnit(null);
      toast({
        title: "Success",
        description: "Unit deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete unit",
        variant: "destructive",
      });
    }
  };

  const handleViewMembers = (unitId: string) => {
    setLocation(`/scouts?unit=${unitId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Units Management</h1>
          <p className="text-muted-foreground">
            Manage scout units and patrols
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-unit">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            className="pl-9"
            data-testid="input-search-units"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : filteredUnits.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">
            {searchQuery ? "No units found matching your search." : "No units available."}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Showing {visibleUnits.length} of {filteredUnits.length} units
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                onEdit={() => setEditingUnit(unit)}
                onViewMembers={() => handleViewMembers(unit.id)}
                onDelete={() => setDeletingUnit(unit)}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Load More ({filteredUnits.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add Unit Dialog */}
      <UnitFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddUnit}
        isLoading={createUnit.isPending}
      />

      {/* Edit Unit Dialog */}
      <UnitFormDialog
        open={!!editingUnit}
        onOpenChange={(open) => !open && setEditingUnit(null)}
        onSubmit={handleEditUnit}
        unit={editingUnit}
        isLoading={updateUnit.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingUnit}
        onOpenChange={(open) => !open && setDeletingUnit(null)}
        title="Delete Unit"
        description={`Are you sure you want to delete "${deletingUnit?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteUnit}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
