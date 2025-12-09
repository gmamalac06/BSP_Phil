import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    description: string;
    date: string; // Date comes as ISO string from database
    location: string;
    attendees?: number; // Optional - will be calculated from attendance records
    capacity: number;
    status: string; // Accept any string, will validate at runtime
    userAttended?: boolean;
  };
  onMarkAttendance?: () => void;
  onViewDetails?: () => void;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-chart-2 text-white",
  ongoing: "bg-chart-1 text-white",
  completed: "bg-muted text-muted-foreground",
};

export function ActivityCard({ activity, onMarkAttendance, onViewDetails }: ActivityCardProps) {
  const attendeeCount = activity.attendees ?? 0; // Default to 0 if not provided
  const statusColor = statusColors[activity.status] || "bg-muted text-muted-foreground";

  return (
    <Card className="hover-elevate" data-testid={`card-activity-${activity.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg mb-2" data-testid={`text-activity-title-${activity.id}`}>
              {activity.title}
            </h3>
            <Badge className={statusColor}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </Badge>
          </div>
          {activity.userAttended && (
            <CheckCircle className="h-5 w-5 text-chart-3" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {activity.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(activity.date), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{activity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{attendeeCount} / {activity.capacity} attendees</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onViewDetails}
            data-testid={`button-view-activity-${activity.id}`}
          >
            View Details
          </Button>
          {activity.status !== "completed" && !activity.userAttended && (
            <Button
              size="sm"
              className="flex-1"
              onClick={onMarkAttendance}
              data-testid={`button-mark-attendance-${activity.id}`}
            >
              Mark Attendance
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
