import { useState, useMemo } from "react";
import { ScoutsTable } from "@/components/scouts-table";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { Download, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScouts, useCreateScout, useUpdateScout, useDeleteScout } from "@/hooks/useScouts";
import { ScoutFormDialog } from "@/components/scout-form-dialog";
import { ViewScoutDialog } from "@/components/view-scout-dialog";
import { DoubleConfirmDialog } from "@/components/double-confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, generateFilename, formatDateForExport, ExportColumn } from "@/lib/export";
import { generateScoutIDCard } from "@/lib/id-card";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import type { Scout } from "@shared/schema";

export default function Scouts() {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<any>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingScout, setEditingScout] = useState<Scout | null>(null);
  const [viewingScout, setViewingScout] = useState<Scout | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingScoutId, setDeletingScoutId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const { data: scouts = [], isLoading } = useScouts();
  const createScout = useCreateScout();
  const updateScout = useUpdateScout();
  const deleteScout = useDeleteScout();
  const { toast } = useToast();

  const filteredScouts = useMemo(() => {
    let result = [...scouts];

    // Apply status filter from tab
    if (activeTab !== "all") {
      result = result.filter((s) => s.status === activeTab);
    }

    // Apply additional filters from FilterPanel
    if (filters.municipality) {
      result = result.filter((s) =>
        s.municipality.toLowerCase().includes(filters.municipality.toLowerCase())
      );
    }
    if (filters.gender) {
      result = result.filter((s) => s.gender === filters.gender);
    }
    if (filters.unit) {
      result = result.filter((s) => s.unitId === filters.unit);
    }
    if (filters.school) {
      result = result.filter((s) => s.schoolId === filters.school);
    }

    return result;
  }, [scouts, activeTab, filters]);

  const handleAddScout = async (data: any) => {
    try {
      await createScout.mutateAsync(data);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Scout added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add scout",
        variant: "destructive",
      });
    }
  };

  const handleEditScout = async (data: any) => {
    if (!editingScout) return;
    try {
      await updateScout.mutateAsync({ id: editingScout.id, data });
      setEditingScout(null);
      toast({
        title: "Success",
        description: "Scout updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update scout",
        variant: "destructive",
      });
    }
  };

  const handleViewScout = (scout: Scout) => {
    setViewingScout(scout);
  };

  const handleDownloadIDCard = async (scoutId: string) => {
    const scout = scouts.find((s) => s.id === scoutId);
    if (!scout) {
      toast({
        title: "Error",
        description: "Scout not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateScoutIDCard({
        scout,
        schoolName: scout.schoolId || undefined,
        unitName: scout.unitId || undefined,
        profilePhotoUrl: scout.profilePhoto || undefined,
      });

      toast({
        title: "ID Card Generated",
        description: `ID card for ${scout.name} has been downloaded.`,
      });
    } catch (error) {
      console.error("Error generating ID card:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate ID card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScout = async (scoutId: string) => {
    try {
      await deleteScout.mutateAsync(scoutId);
      setDeletingScoutId(null);
      setSelectedIds(selectedIds.filter(id => id !== scoutId)); // Remove from selection
      toast({
        title: "Scout Deleted",
        description: "Scout has been permanently removed from the system.",
      });
    } catch (error: any) {
      console.error("Error deleting scout:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete scout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Delete all selected scouts
      await Promise.all(
        selectedIds.map(id => deleteScout.mutateAsync(id))
      );

      setIsBulkDeleting(false);
      setSelectedIds([]);

      toast({
        title: "Bulk Delete Complete",
        description: `Successfully deleted ${selectedIds.length} scout${selectedIds.length === 1 ? "" : "s"}.`,
      });
    } catch (error: any) {
      console.error("Error during bulk delete:", error);
      toast({
        title: "Bulk Delete Failed",
        description: error.message || "Some scouts could not be deleted.",
        variant: "destructive",
      });
    }
  };

  const handleExportScouts = () => {
    const columns: ExportColumn[] = [
      { key: "uid", label: "Scout ID" },
      { key: "name", label: "Name" },
      { key: "gender", label: "Gender" },
      { key: "municipality", label: "Municipality" },
      { key: "status", label: "Status" },
      { key: "contactNumber", label: "Contact Number" },
      { key: "email", label: "Email" },
      { key: "rank", label: "Rank" },
      { key: "membershipYears", label: "Membership Years" },
      {
        key: "dateOfBirth",
        label: "Date of Birth",
        format: formatDateForExport
      },
      {
        key: "createdAt",
        label: "Registered Date",
        format: formatDateForExport
      },
    ];

    exportToCSV(
      filteredScouts,
      columns,
      generateFilename(`scouts_${activeTab}`)
    );

    toast({
      title: "Export successful",
      description: `Exported ${filteredScouts.length} scout(s) to CSV`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Scouts Management</h1>
          <p className="text-muted-foreground">
            View and manage all registered scouts
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleting(true)}
              data-testid="button-bulk-delete"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleExportScouts}
            disabled={filteredScouts.length === 0}
            data-testid="button-export"
          >
            <Download className="h-4 w-4 mr-2" />
            Export ({filteredScouts.length})
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-scout">
            <Plus className="h-4 w-4 mr-2" />
            Add Scout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <FilterPanel onFilter={setFilters} />
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <TableSkeleton rows={10} columns={6} showCheckbox />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">
                  All Scouts ({scouts.length})
                </TabsTrigger>
                <TabsTrigger value="active" data-testid="tab-active">
                  Active ({scouts.filter((s) => s.status === "active").length})
                </TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending">
                  Pending ({scouts.filter((s) => s.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="expired" data-testid="tab-expired">
                  Expired ({scouts.filter((s) => s.status === "expired").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <ScoutsTable
                  scouts={filteredScouts}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onView={handleViewScout}
                  onEdit={setEditingScout}
                  onDownloadId={handleDownloadIDCard}
                  onDelete={(id) => setDeletingScoutId(id)}
                />
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <ScoutsTable
                  scouts={filteredScouts}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onView={handleViewScout}
                  onEdit={setEditingScout}
                  onDownloadId={handleDownloadIDCard}
                  onDelete={(id) => setDeletingScoutId(id)}
                />
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <ScoutsTable
                  scouts={filteredScouts}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onView={handleViewScout}
                  onEdit={setEditingScout}
                  onDownloadId={handleDownloadIDCard}
                  onDelete={(id) => setDeletingScoutId(id)}
                />
              </TabsContent>

              <TabsContent value="expired" className="mt-6">
                <ScoutsTable
                  scouts={filteredScouts}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onView={handleViewScout}
                  onEdit={setEditingScout}
                  onDownloadId={handleDownloadIDCard}
                  onDelete={(id) => setDeletingScoutId(id)}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Add Scout Dialog */}
      <ScoutFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddScout}
        isLoading={createScout.isPending}
      />

      {/* Edit Scout Dialog */}
      <ScoutFormDialog
        open={!!editingScout}
        onOpenChange={(open) => !open && setEditingScout(null)}
        onSubmit={handleEditScout}
        scout={editingScout}
        isLoading={updateScout.isPending}
      />

      {/* View Scout Dialog */}
      <ViewScoutDialog
        open={!!viewingScout}
        onOpenChange={(open) => !open && setViewingScout(null)}
        scout={viewingScout}
      />

      {/* Single Delete Confirmation Dialog */}
      <DoubleConfirmDialog
        open={!!deletingScoutId}
        onOpenChange={(open) => !open && setDeletingScoutId(null)}
        onConfirm={() => deletingScoutId && handleDeleteScout(deletingScoutId)}
        title="Delete Scout?"
        description={`Are you sure you want to delete this scout? All associated data and records will be permanently removed.`}
        confirmText="Delete Scout"
        isLoading={deleteScout.isPending}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DoubleConfirmDialog
        open={isBulkDeleting}
        onOpenChange={setIsBulkDeleting}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.length} Scout${selectedIds.length === 1 ? "" : "s"}?`}
        description={`You are about to permanently delete ${selectedIds.length} scout${selectedIds.length === 1 ? "" : "s"}. Please confirm the deletion.`}
        confirmText={`Delete ${selectedIds.length} Scout${selectedIds.length === 1 ? "" : "s"}`}
        isLoading={deleteScout.isPending}
      />
    </div>
  );
}
