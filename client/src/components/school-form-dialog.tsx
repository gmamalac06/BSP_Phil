import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { School } from "@shared/schema";

interface SchoolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; municipality: string; principal?: string }) => void;
  school?: School | null;
  isLoading?: boolean;
}

export function SchoolFormDialog({
  open,
  onOpenChange,
  onSubmit,
  school,
  isLoading,
}: SchoolFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    municipality: "",
    principal: "",
  });

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        municipality: school.municipality,
        principal: school.principal || "",
      });
    } else {
      setFormData({ name: "", municipality: "", principal: "" });
    }
  }, [school, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      municipality: formData.municipality,
      principal: formData.principal || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{school ? "Edit School" : "Add New School"}</DialogTitle>
          <DialogDescription>
            {school ? "Update school information" : "Enter the details of the new school"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter school name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipality *</Label>
              <Input
                id="municipality"
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                placeholder="Enter municipality"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principal">Principal</Label>
              <Input
                id="principal"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                placeholder="Enter principal name (optional)"
              />
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
              {isLoading ? "Saving..." : school ? "Update School" : "Add School"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


