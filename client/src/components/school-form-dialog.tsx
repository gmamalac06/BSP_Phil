import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import type { School } from "@shared/schema";
import { validateFile } from "@/lib/storage";

interface SchoolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    municipality: string;
    principal?: string;
    schoolNumber?: string;
    logo?: File | string | null;
  }) => void;
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
    schoolNumber: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        municipality: school.municipality,
        principal: school.principal || "",
        schoolNumber: (school as any).schoolNumber || "",
      });
      // If school has existing logo, show it as preview
      if ((school as any).logo) {
        setLogoPreview((school as any).logo);
      } else {
        setLogoPreview(null);
      }
      setLogoFile(null);
    } else {
      setFormData({ name: "", municipality: "", principal: "", schoolNumber: "" });
      setLogoFile(null);
      setLogoPreview(null);
    }
    setLogoError(null);
  }, [school, open]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file, 2, ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
      if (!validation.valid) {
        setLogoError(validation.error || "Invalid file");
        return;
      }
      setLogoError(null);
      setLogoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      municipality: formData.municipality,
      principal: formData.principal || undefined,
      schoolNumber: formData.schoolNumber || undefined,
      logo: logoFile || (logoPreview && !logoFile ? logoPreview : null),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{school ? "Edit School" : "Add New School"}</DialogTitle>
          <DialogDescription>
            {school ? "Update school information" : "Enter the details of the new school"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="schoolNumber">School ID</Label>
                <Input
                  id="schoolNumber"
                  value={formData.schoolNumber}
                  onChange={(e) => setFormData({ ...formData, schoolNumber: e.target.value })}
                  placeholder="e.g., SCH-001"
                />
              </div>
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

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>School Logo</Label>
              {logoPreview ? (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={logoPreview}
                    alt="School logo preview"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={removeLogo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer ${logoError ? "border-destructive" : ""}`}>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Label htmlFor="logo" className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">Upload Logo</span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, WebP (Max 2MB)
                    </span>
                  </Label>
                </div>
              )}
              {logoError && (
                <p className="text-sm text-destructive">{logoError}</p>
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
              {isLoading ? "Saving..." : school ? "Update School" : "Add School"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


