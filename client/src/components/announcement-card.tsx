import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, MoreVertical, Edit, Trash2, Clock } from "lucide-react";
import { safeFormatDistanceToNow, safeFormat } from "@/lib/safe-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Announcement } from "@shared/schema";

interface AnnouncementCardProps {
  announcement: Announcement;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const typeColors = {
  announcement: "bg-chart-1 text-white",
  policy: "bg-chart-2 text-white",
  event: "bg-chart-3 text-white",
};

export function AnnouncementCard({ announcement, onView, onEdit, onDelete }: AnnouncementCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-announcement-${announcement.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 cursor-pointer" onClick={onView}>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={typeColors[announcement.type as keyof typeof typeColors] || "bg-primary"}>
              {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
            </Badge>
            {announcement.smsNotified && (
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                SMS Sent
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg" data-testid={`text-announcement-title-${announcement.id}`}>
            {announcement.title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>
              View Full
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent onClick={onView} className="cursor-pointer">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {announcement.content}
        </p>
        {((announcement as any).eventDate || (announcement as any).endDate) && (
          <div className="mb-3 text-xs text-foreground/80 space-y-1">
            {(announcement as any).eventDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Start:</span>
                <span>{safeFormat((announcement as any).eventDate, "PP")}</span>
                {(announcement as any).eventTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(announcement as any).eventTime}
                  </span>
                )}
              </div>
            )}
            {(announcement as any).endDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">End:</span>
                <span>{safeFormat((announcement as any).endDate, "PP")}</span>
                {(announcement as any).endTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(announcement as any).endTime}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{safeFormatDistanceToNow((announcement as any).created_at || announcement.createdAt)}</span>
          </div>
          <span>By {announcement.author}</span>
        </div>
      </CardContent>
    </Card>
  );
}
