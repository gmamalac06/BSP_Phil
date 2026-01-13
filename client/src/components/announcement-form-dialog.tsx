import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Image, Calendar, Clock } from "lucide-react";
import type { Announcement } from "@shared/schema";
import { validateFile } from "@/lib/storage";

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    content: string;
    type: string;
    author: string;
    eventDate?: string;
    eventTime?: string;
    photo?: File | string | null;
  }) => void;
  announcement?: Announcement | null;
  isLoading?: boolean;
}

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  onSubmit,
  announcement,
  isLoading,
}: AnnouncementFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "announcement",
    author: "",
    eventDate: "",
    eventTime: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        author: announcement.author,
        eventDate: (announcement as any).eventDate ? (announcement as any).eventDate.split('T')[0] : "",
        eventTime: (announcement as any).eventTime || "",
      });
      if ((announcement as any).photo) {
        setPhotoPreview((announcement as any).photo);
      } else {
        setPhotoPreview(null);
      }
      setPhotoFile(null);
    } else {
      setFormData({
        title: "",
        content: "",
        type: "announcement",
        author: "",
        eventDate: "",
        eventTime: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    }
    setPhotoError(null);
  }, [announcement, open]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file, 5, ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
      if (!validation.valid) {
        setPhotoError(validation.error || "Invalid file");
        return;
      }
      setPhotoError(null);
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      eventDate: formData.eventDate || undefined,
      eventTime: formData.eventTime || undefined,
      photo: photoFile || (photoPreview && !photoFile ? photoPreview : null),
    });
  };

  const showEventFields = formData.type === "event";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{announcement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
          <DialogDescription>
            {announcement ? "Update announcement details" : "Create a new announcement to notify scouts and staff"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter announcement content"
                rows={5}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Event Date/Time Fields - shown when type is 'event' */}
            {showEventFields && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Event Date
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Event Time
                  </Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              {photoPreview ? (
                <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={photoPreview}
                    alt="Announcement photo preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer ${photoError ? "border-destructive" : ""}`}>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Label htmlFor="photo" className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">Upload Photo</span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, WebP (Max 5MB)
                    </span>
                  </Label>
                </div>
              )}
              {photoError && (
                <p className="text-sm text-destructive">{photoError}</p>
              )}
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
              {isLoading ? "Saving..." : announcement ? "Update Announcement" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


