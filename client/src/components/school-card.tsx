import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, Users, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SchoolCardProps {
  school: {
    id: string;
    name: string;
    municipality: string;
    scoutCount: number;
    unitCount: number;
    principal: string;
  };
  onEdit?: (id: string) => void;
  onViewScouts?: (id: string) => void;
}

export function SchoolCard({ school, onEdit, onViewScouts }: SchoolCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-school-${school.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <School className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1" data-testid={`text-school-name-${school.id}`}>
              {school.name}
            </h3>
            <p className="text-sm text-muted-foreground">{school.municipality}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-school-menu-${school.id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(school.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit School
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewScouts?.(school.id)}>
              <Users className="mr-2 h-4 w-4" />
              View Scouts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Principal:</span>
            <span className="text-sm font-medium">{school.principal}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Scout Units:</span>
            <span className="text-sm font-medium">{school.unitCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Total Scouts:</span>
            <span className="text-sm font-medium">{school.scoutCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
