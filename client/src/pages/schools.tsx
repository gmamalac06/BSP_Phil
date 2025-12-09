import { useState, useMemo, useEffect } from "react";
import { SchoolCard } from "@/components/school-card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSchools, useCreateSchool, useUpdateSchool, useDeleteSchool } from "@/hooks/useSchools";
import { SchoolFormDialog } from "@/components/school-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, generateFilename, formatDateForExport, ExportColumn } from "@/lib/export";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import type { School } from "@shared/schema";
import { useLocation } from "wouter";

const ITEMS_PER_PAGE = 15;

export default function Schools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [, setLocation] = useLocation();

  const { data: schools = [], isLoading } = useSchools();
  const createSchool = useCreateSchool();
  const updateSchool = useUpdateSchool();
  const deleteSchool = useDeleteSchool();
  const { toast } = useToast();

  // Reset visible count when search changes - moved from useMemo to useEffect
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  const filteredSchools = useMemo(() => {
    if (!searchQuery) return schools;

    const query = searchQuery.toLowerCase();
    return schools.filter(
      (school) =>
        school.name.toLowerCase().includes(query) ||
        school.municipality.toLowerCase().includes(query) ||
        school.principal?.toLowerCase().includes(query)
    );
  }, [schools, searchQuery]);

  const visibleSchools = useMemo(() => {
    return filteredSchools.slice(0, visibleCount);
  }, [filteredSchools, visibleCount]);

  const hasMore = visibleCount < filteredSchools.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleAddSchool = async (data: { name: string; municipality: string; principal?: string }) => {
    try {
      await createSchool.mutateAsync(data);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "School added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add school",
        variant: "destructive",
      });
    }
  };

  const handleEditSchool = async (data: { name: string; municipality: string; principal?: string }) => {
    if (!editingSchool) return;
    try {
      await updateSchool.mutateAsync({ id: editingSchool.id, data });
      setEditingSchool(null);
      toast({
        title: "Success",
        description: "School updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update school",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchool = async () => {
    if (!deletingSchool) return;
    try {
      await deleteSchool.mutateAsync(deletingSchool.id);
      setDeletingSchool(null);
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete school",
        variant: "destructive",
      });
    }
  };

  const handleViewScouts = (schoolId: string) => {
    setLocation(`/scouts?school=${schoolId}`);
  };

  const handleExportSchools = () => {
    const columns: ExportColumn[] = [
      { key: "name", label: "School Name" },
      { key: "municipality", label: "Municipality" },
      { key: "principal", label: "Principal" },
      { key: "createdAt", label: "Added Date", format: formatDateForExport },
    ];

    exportToCSV(
      filteredSchools,
      columns,
      generateFilename("schools")
    );

    toast({
      title: "Export successful",
      description: `Exported ${filteredSchools.length} school(s) to CSV`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schools Management</h1>
          <p className="text-muted-foreground">
            Manage participating schools and institutions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportSchools}
            disabled={filteredSchools.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export ({filteredSchools.length})
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-school">
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            className="pl-9"
            data-testid="input-search-schools"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} columns={4} />
      ) : filteredSchools.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">
            {searchQuery ? "No schools found matching your search." : "No schools available."}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Showing {visibleSchools.length} of {filteredSchools.length} schools
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onEdit={() => setEditingSchool(school)}
                onViewScouts={() => handleViewScouts(school.id)}
                onDelete={() => setDeletingSchool(school)}
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
                Load More ({filteredSchools.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add School Dialog */}
      <SchoolFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSchool}
        isLoading={createSchool.isPending}
      />

      {/* Edit School Dialog */}
      <SchoolFormDialog
        open={!!editingSchool}
        onOpenChange={(open) => !open && setEditingSchool(null)}
        onSubmit={handleEditSchool}
        school={editingSchool}
        isLoading={updateSchool.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingSchool}
        onOpenChange={(open) => !open && setDeletingSchool(null)}
        title="Delete School"
        description={`Are you sure you want to delete "${deletingSchool?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteSchool}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
