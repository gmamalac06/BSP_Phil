import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [schoolSearchOpen, setSchoolSearchOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
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
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="school">School</Label>
              <Popover open={schoolSearchOpen} onOpenChange={setSchoolSearchOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={schoolSearchOpen}
                    className="w-full justify-between font-normal"
                  >
                    {formData.schoolId && formData.schoolId !== "none"
                      ? schools.find((s) => s.id === formData.schoolId)?.name || "Select a school (optional)"
                      : "Select a school (optional)"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)", zIndex: 10000 }}>
                  <Command>
                    <CommandInput
                      placeholder="Search school..."
                      value={schoolSearch}
                      onValueChange={setSchoolSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No school found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="None"
                          onSelect={() => {
                            setFormData({ ...formData, schoolId: "none" });
                            setSchoolSearch("");
                            setSchoolSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.schoolId === "none" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          No school
                        </CommandItem>
                        {schools
                          .filter((s) => s.name.toLowerCase().includes(schoolSearch.toLowerCase()))
                          .slice(0, 50)
                          .map((school) => (
                            <CommandItem
                              key={school.id}
                              value={school.name}
                              onSelect={(currentValue) => {
                                const selected = schools.find((s) => s.name.toLowerCase() === currentValue.toLowerCase());
                                if (selected) {
                                  setFormData({ ...formData, schoolId: selected.id });
                                  setSchoolSearch("");
                                }
                                setSchoolSearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.schoolId === school.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {school.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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


