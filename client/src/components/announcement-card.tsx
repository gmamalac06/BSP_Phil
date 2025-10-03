import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    type: "announcement" | "policy" | "event";
    date: Date;
    author: string;
    smsNotified: boolean;
  };
  onView?: (id: string) => void;
}

const typeColors = {
  announcement: "bg-chart-1 text-white",
  policy: "bg-chart-2 text-white",
  event: "bg-chart-3 text-white",
};

export function AnnouncementCard({ announcement, onView }: AnnouncementCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2" onClick={() => onView?.(announcement.id)} data-testid={`card-announcement-${announcement.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={typeColors[announcement.type]}>
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
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {announcement.content}
        </p>
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(announcement.date, { addSuffix: true })}</span>
          </div>
          <span>By {announcement.author}</span>
        </div>
      </CardContent>
    </Card>
  );
}
