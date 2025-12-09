import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, Users, Edit, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { School as SchoolType } from "@shared/schema";

interface SchoolCardProps {
  school: SchoolType;
  onEdit?: () => void;
  onViewScouts?: () => void;
  onDelete?: () => void;
}

export function SchoolCard({ school, onEdit, onViewScouts, onDelete }: SchoolCardProps) {
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
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit School
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewScouts}>
              <Users className="mr-2 h-4 w-4" />
              View Scouts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete School
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Principal:</span>
            <span className="text-sm font-medium">{school.principal || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Municipality:</span>
            <span className="text-sm font-medium">{school.municipality}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
