import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, GripVertical, Image, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { validateFile } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { carouselService } from "@/lib/supabase-db";
import { useLocation } from "wouter";
import type { CarouselSlide } from "@shared/schema";

export default function CarouselSettings() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        linkUrl: "",
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const { data: slides = [], isLoading } = useQuery({
        queryKey: ["carousel-slides"],
        queryFn: () => carouselService.getAll(),
    });

    // Upload image to Supabase Storage
    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split(".").pop();
        const fileName = `carousel-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
            .from("carousel-slides")
            .upload(filePath, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data: { publicUrl } } = supabase.storage
            .from("carousel-slides")
            .getPublicUrl(filePath);

        return publicUrl;
    };

    // Create slide mutation
    const createSlide = useMutation({
        mutationFn: async () => {
            if (!imageFile) throw new Error("Image is required");

            const imageUrl = await uploadImage(imageFile);
            const maxOrder = Math.max(0, ...slides.map(s => s.display_order));

            return carouselService.create({
                title: formData.title,
                description: formData.description || null,
                image_url: imageUrl,
                link_url: formData.linkUrl || null,
                display_order: maxOrder + 1,
                is_active: formData.isActive,
            } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
            resetForm();
            toast({ title: "Success", description: "Slide created successfully" });
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    // Update slide mutation
    const updateSlide = useMutation({
        mutationFn: async (id: string) => {
            let imageUrl = editingSlide?.image_url;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            return carouselService.update(id, {
                title: formData.title,
                description: formData.description || null,
                image_url: imageUrl,
                link_url: formData.linkUrl || null,
                is_active: formData.isActive,
            } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
            resetForm();
            toast({ title: "Success", description: "Slide updated successfully" });
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    // Delete slide mutation
    const deleteSlide = useMutation({
        mutationFn: (id: string) => carouselService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
            toast({ title: "Success", description: "Slide deleted successfully" });
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    // Reorder slide mutation
    const reorderSlide = useMutation({
        mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
            const sortedSlides = [...slides].sort((a, b) => a.display_order - b.display_order);
            const currentIndex = sortedSlides.findIndex(s => s.id === id);
            const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

            if (targetIndex < 0 || targetIndex >= sortedSlides.length) return;

            const currentSlide = sortedSlides[currentIndex];
            const targetSlide = sortedSlides[targetIndex];

            // Swap display orders
            await carouselService.update(currentSlide.id, { display_order: targetSlide.display_order } as any);
            await carouselService.update(targetSlide.id, { display_order: currentSlide.display_order } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
        },
    });

    const resetForm = () => {
        setIsDialogOpen(false);
        setEditingSlide(null);
        setFormData({ title: "", description: "", linkUrl: "", isActive: true });
        setImageFile(null);
        setImagePreview(null);
        setImageError(null);
    };

    const handleOpenDialog = (slide?: CarouselSlide) => {
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title: slide.title,
                description: slide.description || "",
                linkUrl: slide.link_url || "",
                isActive: slide.is_active,
            });
            setImagePreview(slide.image_url);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validation = validateFile(file, 5, ["image/jpeg", "image/png", "image/jpg", "image/webp"]);
            if (!validation.valid) {
                setImageError(validation.error || "Invalid file");
                return;
            }
            setImageError(null);
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile && !editingSlide) {
            setImageError("Image is required");
            return;
        }

        if (editingSlide) {
            updateSlide.mutate(editingSlide.id);
        } else {
            createSlide.mutate();
        }
    };

    const sortedSlides = [...slides].sort((a, b) => a.display_order - b.display_order);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/settings")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-4xl font-bold mb-2">Carousel Settings</h1>
                    <p className="text-muted-foreground">
                        Manage landing page event slides
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slide
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading slides...</p>
                </div>
            ) : sortedSlides.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                        <Image className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No slides yet. Add your first slide!</p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slide
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {sortedSlides.map((slide, index) => (
                        <Card key={slide.id} className={!slide.is_active ? "opacity-60" : ""}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-32 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                        <img
                                            src={slide.image_url}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/bsp-logo.svg";
                                                target.style.padding = "20px";
                                                target.style.objectFit = "contain";
                                                target.className = "w-full h-full bg-muted";
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{slide.title}</h3>
                                        {slide.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {slide.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${slide.is_active ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"
                                                }`}>
                                                {slide.is_active ? "Active" : "Inactive"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Order: {slide.display_order}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Reorder Buttons */}
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            disabled={index === 0}
                                            onClick={() => reorderSlide.mutate({ id: slide.id, direction: "up" })}
                                        >
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            disabled={index === sortedSlides.length - 1}
                                            onClick={() => reorderSlide.mutate({ id: slide.id, direction: "down" })}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleOpenDialog(slide)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => deleteSlide.mutate(slide.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingSlide ? "Edit Slide" : "Add New Slide"}</DialogTitle>
                        <DialogDescription>
                            {editingSlide ? "Update slide details" : "Add a new slide to the landing page carousel"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Event title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Short description (optional)"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkUrl">Link URL</Label>
                                <Input
                                    id="linkUrl"
                                    value={formData.linkUrl}
                                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                    placeholder="https://example.com (optional)"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Image {!editingSlide && "*"}</Label>
                                {imagePreview ? (
                                    <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-muted">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(editingSlide?.imageUrl || null);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer ${imageError ? "border-destructive" : ""}`}>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <Label htmlFor="image" className="flex flex-col items-center gap-2 cursor-pointer">
                                            <Image className="h-8 w-8 text-muted-foreground" />
                                            <span className="text-sm font-medium">Upload Image</span>
                                            <span className="text-xs text-muted-foreground">
                                                JPG, PNG, WebP (Max 5MB, recommended 1920x1080)
                                            </span>
                                        </Label>
                                    </div>
                                )}
                                {imageError && <p className="text-sm text-destructive">{imageError}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="isActive">Active</Label>
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createSlide.isPending || updateSlide.isPending}>
                                {createSlide.isPending || updateSlide.isPending ? "Saving..." : editingSlide ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
