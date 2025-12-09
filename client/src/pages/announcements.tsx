import { useState, useMemo, useEffect } from "react";
import { AnnouncementCard } from "@/components/announcement-card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from "@/hooks/useAnnouncements";
import { AnnouncementFormDialog } from "@/components/announcement-form-dialog";
import { ViewAnnouncementDialog } from "@/components/view-announcement-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import type { Announcement } from "@shared/schema";

const ITEMS_PER_PAGE = 15;

export default function Announcements() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { data: announcements = [], isLoading } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const { toast } = useToast();

  // Reset visible count when tab changes - moved from useMemo to useEffect to avoid re-render loop
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeTab]);

  const filteredAnnouncements = useMemo(() => {
    if (activeTab === "all") return announcements;
    return announcements.filter((a) => a.type === activeTab);
  }, [announcements, activeTab]);

  const visibleAnnouncements = useMemo(() => {
    return filteredAnnouncements.slice(0, visibleCount);
  }, [filteredAnnouncements, visibleCount]);

  const hasMore = visibleCount < filteredAnnouncements.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleCreateAnnouncement = async (data: {
    title: string;
    content: string;
    type: string;
    author: string;
  }) => {
    try {
      await createAnnouncement.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement",
        variant: "destructive",
      });
    }
  };

  const handleEditAnnouncement = async (data: {
    title: string;
    content: string;
    type: string;
    author: string;
  }) => {
    if (!editingAnnouncement) return;
    try {
      await updateAnnouncement.mutateAsync({ id: editingAnnouncement.id, data });
      setEditingAnnouncement(null);
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!deletingAnnouncement) return;
    try {
      await deleteAnnouncement.mutateAsync(deletingAnnouncement.id);
      setDeletingAnnouncement(null);
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Announcements</h1>
          <p className="text-muted-foreground">
            View and manage announcements and policies
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-announcement">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton count={6} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-announcements">
              All ({announcements.length})
            </TabsTrigger>
            <TabsTrigger value="announcement" data-testid="tab-announcements">
              Announcements ({announcements.filter((a) => a.type === "announcement").length})
            </TabsTrigger>
            <TabsTrigger value="policy" data-testid="tab-policies">
              Policies ({announcements.filter((a) => a.type === "policy").length})
            </TabsTrigger>
            <TabsTrigger value="event" data-testid="tab-events">
              Events ({announcements.filter((a) => a.type === "event").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredAnnouncements.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">No announcements found.</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Showing {visibleAnnouncements.length} of {filteredAnnouncements.length} announcements
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {visibleAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      onView={() => setViewingAnnouncement(announcement)}
                      onEdit={() => setEditingAnnouncement(announcement)}
                      onDelete={() => setDeletingAnnouncement(announcement)}
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
                      Load More ({filteredAnnouncements.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Create Announcement Dialog */}
      <AnnouncementFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAnnouncement}
        isLoading={createAnnouncement.isPending}
      />

      {/* Edit Announcement Dialog */}
      <AnnouncementFormDialog
        open={!!editingAnnouncement}
        onOpenChange={(open) => !open && setEditingAnnouncement(null)}
        onSubmit={handleEditAnnouncement}
        announcement={editingAnnouncement}
        isLoading={updateAnnouncement.isPending}
      />

      {/* View Announcement Dialog */}
      <ViewAnnouncementDialog
        open={!!viewingAnnouncement}
        onOpenChange={(open) => !open && setViewingAnnouncement(null)}
        announcement={viewingAnnouncement}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingAnnouncement}
        onOpenChange={(open) => !open && setDeletingAnnouncement(null)}
        title="Delete Announcement"
        description={`Are you sure you want to delete "${deletingAnnouncement?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteAnnouncement}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
