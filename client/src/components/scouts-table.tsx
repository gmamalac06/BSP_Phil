import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit, Download, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Scout {
  id: string;
  uid: string;
  name: string;
  unit: string;
  school: string;
  municipality: string;
  gender: string;
  status: "active" | "pending" | "expired";
  membershipYears: number;
  avatar?: string;
}

interface ScoutsTableProps {
  scouts: Scout[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onView?: (scout: Scout) => void;
  onEdit?: (scout: Scout) => void;
  onDownloadId?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  active: "bg-chart-3 text-white",
  pending: "bg-chart-2 text-white",
  expired: "bg-muted text-muted-foreground",
};

export function ScoutsTable({ scouts, selectedIds, onSelectionChange, onView, onEdit, onDownloadId, onDelete }: ScoutsTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(scouts.map(s => s.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected = scouts.length > 0 && selectedIds.length === scouts.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < scouts.length;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all scouts"
                className={isSomeSelected ? "data-[state=checked]:bg-primary/50" : ""}
              />
            </TableHead>
            <TableHead>Scout</TableHead>
            <TableHead>UID</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Municipality</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Years</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scouts.map((scout) => {
            const initials = scout.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const isSelected = selectedIds.includes(scout.id);

            return (
              <TableRow 
                key={scout.id} 
                data-testid={`row-scout-${scout.id}`}
                className={isSelected ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectOne(scout.id, checked as boolean)}
                    aria-label={`Select ${scout.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={scout.avatar} alt={scout.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{scout.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs font-mono">{scout.uid}</code>
                </TableCell>
                <TableCell>{scout.unit}</TableCell>
                <TableCell>{scout.school}</TableCell>
                <TableCell>{scout.municipality}</TableCell>
                <TableCell>{scout.gender}</TableCell>
                <TableCell>{scout.membershipYears}</TableCell>
                <TableCell>
                  <Badge className={statusColors[scout.status]}>
                    {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView?.(scout)}
                      data-testid={`button-view-${scout.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(scout)}
                      data-testid={`button-edit-${scout.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownloadId?.(scout.id)}
                      data-testid={`button-download-id-${scout.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete?.(scout.id)}
                      data-testid={`button-delete-${scout.id}`}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
