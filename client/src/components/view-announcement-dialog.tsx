import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{announcement.content}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


