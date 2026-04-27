import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { safeFormat } from "@/lib/safe-date";
import type { Announcement } from "@shared/schema";

interface ViewAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

const typeColors = {
  announcement: "bg-chart-2",
  policy: "bg-chart-4",
  event: "bg-chart-1",
};

export function ViewAnnouncementDialog({
  open,
  onOpenChange,
  announcement,
}: ViewAnnouncementDialogProps) {
  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{announcement.title}</DialogTitle>
            <Badge className={typeColors[announcement.type as keyof typeof typeColors] || "bg-primary"}>
              {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
            </Badge>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {announcement.author}</span>
            <span>•</span>
            <span>{safeFormat((announcement as any).created_at || announcement.createdAt, "PPP")}</span>
          </div>
          {((announcement as any).eventDate || (announcement as any).endDate) && (
            <div className="flex flex-wrap gap-3 text-sm rounded-md border p-3 bg-muted/40">
              {(announcement as any).eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Start:</span>
                  <span>{safeFormat((announcement as any).eventDate, "PPP")}</span>
                  {(announcement as any).eventTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {(announcement as any).eventTime}
                    </span>
                  )}
                </div>
              )}
              {(announcement as any).endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">End:</span>
                  <span>{safeFormat((announcement as any).endDate, "PPP")}</span>
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
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{announcement.content}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


