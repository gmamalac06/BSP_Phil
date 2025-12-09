import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchools } from "@/hooks/useSchools";
import type { Unit } from "@shared/schema";

interface UnitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; leader: string; schoolId?: string; status: string }) => void;
  unit?: Unit | null;
  isLoading?: boolean;
}

export function UnitFormDialog({
  open,
  onOpenChange,
  onSubmit,
  unit,
  isLoading,
}: UnitFormDialogProps) {
  const { data: schools = [] } = useSchools();
  const [formData, setFormData] = useState({
    name: "",
    leader: "",
    schoolId: "none",
    status: "active",
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name,
        leader: unit.leader,
        schoolId: unit.schoolId || "none",
        status: unit.status,
      });
    } else {
      setFormData({ name: "", leader: "", schoolId: "none", status: "active" });
    }
  }, [unit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      leader: formData.leader,
      schoolId: formData.schoolId === "none" ? undefined : formData.schoolId,
      status: formData.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{unit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
          <DialogDescription>
            {unit ? "Update unit information" : "Enter the details of the new scout unit"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Unit Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter unit name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leader">Unit Leader *</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                placeholder="Enter leader name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Select
                value={formData.schoolId}
                onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
              >
                <SelectTrigger id="school">
                  <SelectValue placeholder="Select a school (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No school</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : unit ? "Update Unit" : "Add Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


