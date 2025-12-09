import { useState, useMemo } from "react";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity } from "@/hooks/useActivities";
import { ActivityFormDialog } from "@/components/activity-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { MarkAttendanceDialog } from "@/components/mark-attendance-dialog";
import { ViewActivityDialog } from "@/components/view-activity-dialog";
import { useToast } from "@/hooks/use-toast";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import type { Activity } from "@shared/schema";

const ITEMS_PER_PAGE = 15;

export default function Activities() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [attendanceActivity, setAttendanceActivity] = useState<Activity | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const [visibleCounts, setVisibleCounts] = useState({
    upcoming: ITEMS_PER_PAGE,
    ongoing: ITEMS_PER_PAGE,
    completed: ITEMS_PER_PAGE,
  });

  const { data: activities = [], isLoading } = useActivities();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const { toast } = useToast();

  const categorizedActivities = useMemo(() => {
    const now = new Date();

    return {
      upcoming: activities.filter((a) => new Date(a.date) > now && a.status !== "completed"),
      ongoing: activities.filter((a) => a.status === "ongoing"),
      completed: activities.filter((a) => a.status === "completed" || new Date(a.date) < now),
    };
  }, [activities]);

  const handleLoadMore = (category: 'upcoming' | 'ongoing' | 'completed') => {
    setVisibleCounts((prev) => ({
      ...prev,
      [category]: prev[category] + ITEMS_PER_PAGE,
    }));
  };

  const renderActivityGrid = (activityList: Activity[], category: 'upcoming' | 'ongoing' | 'completed') => {
    const visibleCount = visibleCounts[category];
    const visibleActivities = activityList.slice(0, visibleCount);
    const hasMore = visibleCount < activityList.length;

    if (activityList.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">No {category} activities.</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Showing {visibleActivities.length} of {activityList.length} activities
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onMarkAttendance={() => setAttendanceActivity(activity)}
              onViewDetails={() => setViewingActivity(activity)}
            />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => handleLoadMore(category)}
              className="gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Load More ({activityList.length - visibleCount} remaining)
            </Button>
          </div>
        )}
      </div>
    );
  };

  const handleCreateActivity = async (data: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
  }) => {
    try {
      // Send data as-is, no conversion needed
      await createActivity.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Activity created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create activity",
        variant: "destructive",
      });
    }
  };

  const handleEditActivity = async (data: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
  }) => {
    if (!editingActivity) return;
    try {
      // Send data as-is, dates are strings now
      await updateActivity.mutateAsync({
        id: editingActivity.id,
        data: data,
      });
      setEditingActivity(null);
      toast({
        title: "Success",
        description: "Activity updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update activity",
        variant: "destructive",
      });
    }
  };

  const handleDeleteActivity = async () => {
    if (!deletingActivity) return;
    try {
      await deleteActivity.mutateAsync(deletingActivity.id);
      setDeletingActivity(null);
      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete activity",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Activities & Events</h1>
          <p className="text-muted-foreground">
            Manage scout activities and track attendance
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-activity">
          <Plus className="h-4 w-4 mr-2" />
          Create Activity
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton count={6} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              Upcoming ({categorizedActivities.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="ongoing" data-testid="tab-ongoing">
              Ongoing ({categorizedActivities.ongoing.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({categorizedActivities.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {renderActivityGrid(categorizedActivities.upcoming, 'upcoming')}
          </TabsContent>

          <TabsContent value="ongoing" className="mt-6">
            {renderActivityGrid(categorizedActivities.ongoing, 'ongoing')}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {renderActivityGrid(categorizedActivities.completed, 'completed')}
          </TabsContent>
        </Tabs>
      )}

      {/* Create Activity Dialog */}
      <ActivityFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateActivity}
        isLoading={createActivity.isPending}
      />

      {/* Edit Activity Dialog */}
      <ActivityFormDialog
        open={!!editingActivity}
        onOpenChange={(open) => !open && setEditingActivity(null)}
        onSubmit={handleEditActivity}
        activity={editingActivity}
        isLoading={updateActivity.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingActivity}
        onOpenChange={(open) => !open && setDeletingActivity(null)}
        title="Delete Activity"
        description={`Are you sure you want to delete "${deletingActivity?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteActivity}
        confirmText="Delete"
        variant="destructive"
      />

      {/* Mark Attendance Dialog */}
      <MarkAttendanceDialog
        open={!!attendanceActivity}
        onOpenChange={(open) => !open && setAttendanceActivity(null)}
        activity={attendanceActivity}
      />

      {/* View Activity Details Dialog */}
      <ViewActivityDialog
        open={!!viewingActivity}
        onOpenChange={(open) => !open && setViewingActivity(null)}
        activity={viewingActivity}
      />
    </div>
  );
}
