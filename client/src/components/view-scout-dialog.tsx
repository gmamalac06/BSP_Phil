import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Phone, User, School, Users as UsersIcon, IdCard, X } from "lucide-react";
import { format } from "date-fns";
import { ScoutIDCard } from "@/components/scout-id-card";
import type { Scout } from "@shared/schema";

interface ViewScoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scout: Scout | null;
  schoolName?: string;
  unitName?: string;
}

const statusColors = {
  active: "bg-chart-3 text-white",
  pending: "bg-chart-2 text-white",
  expired: "bg-muted text-muted-foreground",
};

export function ViewScoutDialog({
  open,
  onOpenChange,
  scout,
  schoolName,
  unitName,
}: ViewScoutDialogProps) {
  const [showIDCard, setShowIDCard] = useState(false);

  if (!scout) return null;

  // ID Card Preview View
  if (showIDCard) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Scout ID Card Preview</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowIDCard(false)}>
                <X className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <ScoutIDCard
              scout={scout}
              schoolName={schoolName}
              unitName={unitName}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl mb-2">{scout.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[scout.status as keyof typeof statusColors] || "bg-primary"}>
                  {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">{scout.gender}</span>
              </div>
            </div>
            <Button onClick={() => setShowIDCard(true)} variant="outline" size="sm">
              <IdCard className="h-4 w-4 mr-2" />
              View ID Card
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scout ID */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <IdCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Scout UID</div>
              <div className="font-mono font-semibold">{scout.uid}</div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {scout.dateOfBirth && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-xs text-muted-foreground">Date of Birth</div>
                    <div className="text-sm">{format(new Date(scout.dateOfBirth), "PPP")}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Municipality</div>
                  <div className="text-sm">{scout.municipality}</div>
                </div>
              </div>
            </div>

            {scout.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div className="text-sm">{scout.address}</div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {scout.contactNumber && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-xs text-muted-foreground">Contact Number</div>
                    <div className="text-sm">{scout.contactNumber}</div>
                  </div>
                </div>
              )}
              {scout.parentGuardian && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-xs text-muted-foreground">Parent/Guardian</div>
                    <div className="text-sm">{scout.parentGuardian}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Scout Affiliation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Scout Affiliation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <School className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">School</div>
                  <div className="text-sm">{scout.schoolId || "Not assigned"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UsersIcon className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Unit</div>
                  <div className="text-sm">{scout.unitId || "Not assigned"}</div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <div className="text-xs text-muted-foreground">Membership Years</div>
                <div className="text-sm">{scout.membershipYears} {scout.membershipYears === 1 ? 'year' : 'years'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Registration Date */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Registered on {format(new Date(scout.createdAt), "PPP")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


