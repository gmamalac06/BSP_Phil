import { lazy, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { safeFormat } from "@/lib/safe-date";
import { useActivityAttendance } from "@/hooks/useAttendance";
import type { Activity } from "@shared/schema";

// Lazy load MapDisplay for read-only map view
const MapDisplay = lazy(() => import("@/components/map-selector").then(m => ({ default: m.MapDisplay })));

interface ViewActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
}

const statusColors = {
  upcoming: "bg-chart-2 text-white",
  ongoing: "bg-chart-1 text-white",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

export function ViewActivityDialog({
  open,
  onOpenChange,
  activity,
}: ViewActivityDialogProps) {
  const { data: attendance = [] } = useActivityAttendance(activity?.id || "");

  if (!activity) return null;

  const attendedCount = attendance.filter((a) => a.attended).length;
  const attendanceRate = activity.capacity > 0
    ? Math.round((attendedCount / activity.capacity) * 100)
    : 0;

  // Check if activity has map coordinates
  const hasMapLocation = (activity as any).latitude && (activity as any).longitude;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl mb-2">{activity.title}</DialogTitle>
              <Badge className={statusColors[activity.status as keyof typeof statusColors] || "bg-primary"}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {activity.description}
            </p>
          </div>

          <Separator />

          {/* Activity Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Activity Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Date & Time</div>
                  <div className="text-sm">{safeFormat((activity as any).date, "PPP p")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="text-sm">{activity.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Display - Only show if coordinates exist */}
          {hasMapLocation && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Map
                </h3>
                <Suspense fallback={
                  <div className="h-48 rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Loading map...</p>
                  </div>
                }>
                  <MapDisplay
                    latitude={parseFloat((activity as any).latitude)}
                    longitude={parseFloat((activity as any).longitude)}
                    height="200px"
                  />
                </Suspense>
              </div>
            </>
          )}

          <Separator />

          {/* Attendance Statistics */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Attendance Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                  <div className="text-2xl font-bold">{activity.capacity}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-chart-3 mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Attended</div>
                  <div className="text-2xl font-bold">{attendedCount}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-chart-1 mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Rate</div>
                  <div className="text-2xl font-bold">{attendanceRate}%</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Attendance Progress</span>
                <span>{attendedCount} / {activity.capacity}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-chart-3 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Attendees List */}
          {attendance.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">
                Attendees ({attendedCount})
              </h3>
              <div className="max-h-48 overflow-y-auto border rounded-md">
                <div className="divide-y">
                  {attendance
                    .filter((a) => a.attended)
                    .map((a) => (
                      <div key={a.id} className="p-3 text-sm">
                        Scout ID: {a.scoutId}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Meta Information */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created on {safeFormat((activity as any).created_at || activity.createdAt, "PPP")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
