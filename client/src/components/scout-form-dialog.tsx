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
import { Textarea } from "@/components/ui/textarea";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import type { Scout } from "@shared/schema";

interface ScoutFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  scout?: Scout | null;
  isLoading?: boolean;
}

export function ScoutFormDialog({
  open,
  onOpenChange,
  onSubmit,
  scout,
  isLoading,
}: ScoutFormDialogProps) {
  const { data: schools = [] } = useSchools();
  const { data: units = [] } = useUnits();

  const [schoolSearchOpen, setSchoolSearchOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [unitSearchOpen, setUnitSearchOpen] = useState(false);
  const [unitSearch, setUnitSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    gender: "",
    municipality: "",
    dateOfBirth: "",
    address: "",
    contactNumber: "",
    email: "",
    parentGuardian: "",
    emergencyContact: "",
    bloodType: "",
    rank: "",
    unitId: "none",
    schoolId: "none",
    status: "pending",
  });

  useEffect(() => {
    if (scout) {
      const dob = scout.dateOfBirth ? new Date(scout.dateOfBirth).toISOString().split('T')[0] : "";
      setFormData({
        name: scout.name,
        uid: scout.uid,
        gender: scout.gender,
        municipality: scout.municipality,
        dateOfBirth: dob,
        address: scout.address || "",
        contactNumber: scout.contactNumber || "",
        email: scout.email || "",
        parentGuardian: scout.parentGuardian || "",
        emergencyContact: scout.emergencyContact || "",
        bloodType: scout.bloodType || "",
        rank: scout.rank || "",
        unitId: scout.unitId || "none",
        schoolId: scout.schoolId || "none",
        status: scout.status,
      });
    } else {
      // Generate UID for new scout
      const year = new Date().getFullYear();
      const random = Math.random().toString().slice(2, 8);
      setFormData({
        name: "",
        uid: `BSP-${year}-${random}`,
        gender: "",
        municipality: "",
        dateOfBirth: "",
        address: "",
        contactNumber: "",
        email: "",
        parentGuardian: "",
        emergencyContact: "",
        bloodType: "",
        rank: "",
        unitId: "none",
        schoolId: "none",
        status: "pending",
      });
    }
  }, [scout, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      unitId: formData.unitId === "none" ? null : formData.unitId,
      schoolId: formData.schoolId === "none" ? null : formData.schoolId,
      address: formData.address || null,
      contactNumber: formData.contactNumber || null,
      email: formData.email || null,
      parentGuardian: formData.parentGuardian || null,
      emergencyContact: formData.emergencyContact || null,
      bloodType: formData.bloodType || null,
      rank: formData.rank || null,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
      membershipYears: scout?.membershipYears || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{scout ? "Edit Scout" : "Add New Scout"}</DialogTitle>
          <DialogDescription>
            {scout ? "Update scout information" : "Enter the details of the new scout"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uid">Scout UID *</Label>
                  <Input
                    id="uid"
                    value={formData.uid}
                    onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                    placeholder="BSP-2024-XXXXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender || undefined}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
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
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.contactNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      setFormData({ ...formData, contactNumber: value });
                    }}
                    placeholder="09XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentGuardian">Parent/Guardian</Label>
                  <Input
                    id="parentGuardian"
                    value={formData.parentGuardian}
                    onChange={(e) => setFormData({ ...formData, parentGuardian: e.target.value })}
                    placeholder="Enter parent/guardian name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.emergencyContact}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      setFormData({ ...formData, emergencyContact: value });
                    }}
                    placeholder="09XXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Medical & Scout Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Medical & Scout Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={formData.bloodType || undefined}
                    onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                  >
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank">Current Rank</Label>
                  <Select
                    value={formData.rank || undefined}
                    onValueChange={(value) => setFormData({ ...formData, rank: value })}
                  >
                    <SelectTrigger id="rank">
                      <SelectValue placeholder="Select rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenderfoot">Tenderfoot</SelectItem>
                      <SelectItem value="second-class">Second Class</SelectItem>
                      <SelectItem value="first-class">First Class</SelectItem>
                      <SelectItem value="eagle">Eagle Scout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Scout Affiliation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Scout Affiliation</h3>
              <div className="grid grid-cols-2 gap-4">
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
                          ? schools.find((s) => s.id === formData.schoolId)?.name || "Select school (optional)"
                          : "Select school (optional)"}
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
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="unit">Unit</Label>
                  <Popover open={unitSearchOpen} onOpenChange={setUnitSearchOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={unitSearchOpen}
                        className="w-full justify-between font-normal"
                      >
                        {formData.unitId && formData.unitId !== "none"
                          ? units.find((u) => u.id === formData.unitId)?.name || "Select unit (optional)"
                          : "Select unit (optional)"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start" style={{ width: "var(--radix-popover-trigger-width)", zIndex: 10000 }}>
                      <Command>
                        <CommandInput
                          placeholder="Search unit..."
                          value={unitSearch}
                          onValueChange={setUnitSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No unit found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="None"
                              onSelect={() => {
                                setFormData({ ...formData, unitId: "none" });
                                setUnitSearch("");
                                setUnitSearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.unitId === "none" ? "opacity-100" : "opacity-0"
                                )}
                              />
                              No unit
                            </CommandItem>
                            {units
                              .filter((u) => u.name.toLowerCase().includes(unitSearch.toLowerCase()))
                              .slice(0, 50)
                              .map((unit) => (
                                <CommandItem
                                  key={unit.id}
                                  value={unit.name}
                                  onSelect={(currentValue) => {
                                    const selected = units.find((u) => u.name.toLowerCase() === currentValue.toLowerCase());
                                    if (selected) {
                                      setFormData({ ...formData, unitId: selected.id });
                                      setUnitSearch("");
                                    }
                                    setUnitSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.unitId === unit.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {unit.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              {isLoading ? "Saving..." : scout ? "Update Scout" : "Add Scout"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


