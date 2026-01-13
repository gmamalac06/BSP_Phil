import { useState, useEffect, lazy, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import type { Activity } from "@shared/schema";

// Lazy load MapSelector to avoid SSR issues
const MapSelector = lazy(() => import("@/components/map-selector").then(m => ({ default: m.MapSelector })));

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
    location: string;
    latitude?: string | null;
    longitude?: string | null;
    capacity: number;
    status: string;
  }) => void;
  activity?: Activity | null;
  isLoading?: boolean;
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  onSubmit,
  activity,
  isLoading,
}: ActivityFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    latitude: null as string | null,
    longitude: null as string | null,
    capacity: 50,
    status: "upcoming",
  });

  useEffect(() => {
    if (activity) {
      const activityDate = new Date(activity.date);
      const formattedDate = activityDate.toISOString().slice(0, 16); // Format for datetime-local input

      setFormData({
        title: activity.title,
        description: activity.description,
        date: formattedDate,
        location: activity.location,
        latitude: (activity as any).latitude || null,
        longitude: (activity as any).longitude || null,
        capacity: activity.capacity,
        status: activity.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        latitude: null,
        longitude: null,
        capacity: 50,
        status: "upcoming",
      });
    }
  }, [activity, open]);

  const handleLocationChange = (lat: number, lng: number, address?: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      location: address || prev.location,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "Create New Activity"}</DialogTitle>
          <DialogDescription>
            {activity ? "Update activity details" : "Enter the details for the new activity or event"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter activity title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter activity description"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="location">Location *</Label>
              </div>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Search or click on map to select location"
                required
              />
            </div>

            {/* Map Selector - Always visible */}
            <Suspense fallback={
              <div className="h-64 rounded-lg border bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Loading map...</p>
              </div>
            }>
              <MapSelector
                latitude={formData.latitude ? parseFloat(formData.latitude) : null}
                longitude={formData.longitude ? parseFloat(formData.longitude) : null}
                onLocationChange={handleLocationChange}
              />
            </Suspense>

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
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
              {isLoading ? "Saving..." : activity ? "Update Activity" : "Create Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
