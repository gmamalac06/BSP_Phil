import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Unit } from "@shared/schema";

interface UnitCardProps {
  unit: Unit;
  onEdit?: () => void;
  onViewMembers?: () => void;
  onDelete?: () => void;
}

export function UnitCard({ unit, onEdit, onViewMembers, onDelete }: UnitCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-unit-${unit.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2" data-testid={`text-unit-name-${unit.id}`}>
            {unit.name}
          </h3>
          <Badge className={unit.status === "active" ? "bg-chart-3 text-white" : "bg-muted text-muted-foreground"}>
            {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-unit-menu-${unit.id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Unit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewMembers}>
              <Users className="mr-2 h-4 w-4" />
              View Members
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Unit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Unit Leader:</span>
            <span className="text-sm font-medium">{unit.leader}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge className={unit.status === "active" ? "bg-chart-3 text-white" : "bg-muted text-muted-foreground"}>
              {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
