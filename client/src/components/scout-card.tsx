import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScoutCardProps {
  scout: {
    id: string;
    uid: string;
    name: string;
    unit: string;
    school: string;
    status: "active" | "pending" | "expired";
    avatar?: string;
    membershipYears: number;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusColors = {
  active: "bg-chart-3 text-white",
  pending: "bg-chart-2 text-white",
  expired: "bg-muted text-muted-foreground",
};

export function ScoutCard({ scout, onView, onEdit }: ScoutCardProps) {
  const initials = scout.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover-elevate" data-testid={`card-scout-${scout.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={scout.avatar} alt={scout.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold" data-testid={`text-scout-name-${scout.id}`}>{scout.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{scout.uid}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-scout-menu-${scout.id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(scout.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(scout.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Unit:</span>
            <span className="text-sm font-medium">{scout.unit}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">School:</span>
            <span className="text-sm font-medium truncate">{scout.school}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Years:</span>
            <span className="text-sm font-medium">{scout.membershipYears}</span>
          </div>
          <div className="pt-2">
            <Badge className={statusColors[scout.status]} data-testid={`badge-status-${scout.id}`}>
              {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
