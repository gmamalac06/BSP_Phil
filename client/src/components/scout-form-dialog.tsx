import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
                    value={formData.gender}
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
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="+63 XXX XXX XXXX"
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
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="+63 XXX XXX XXXX"
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
                    value={formData.bloodType}
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
                    value={formData.rank}
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
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Select
                    value={formData.schoolId}
                    onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
                  >
                    <SelectTrigger id="school">
                      <SelectValue placeholder="Select school (optional)" />
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
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.unitId}
                    onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No unit</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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


