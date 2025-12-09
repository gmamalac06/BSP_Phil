import { RegistrationForm } from "@/components/registration-form";
import { useCreateScout } from "@/hooks/useScouts";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadPaymentProof, uploadProfilePhoto } from "@/lib/storage";

export default function Registration() {
  const [, setLocation] = useLocation();
  const createScout = useCreateScout();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Generate a unique ID for the scout first
      const tempScoutId = `temp-${Date.now()}`;

      let paymentProofUrl = null;
      let profilePhotoUrl = null;

      // Upload profile photo if provided
      if (data.profilePhoto) {
        try {
          profilePhotoUrl = await uploadProfilePhoto(tempScoutId, data.profilePhoto);
          toast({
            title: "Photo Uploaded",
            description: "Profile photo uploaded successfully",
          });
        } catch (uploadError: any) {
          console.error("Photo upload failed:", uploadError);
          toast({
            title: "Upload Failed",
            description: uploadError.message || "Failed to upload profile photo",
            variant: "destructive",
          });
          // Continue with registration even if upload fails
        }
      }

      // Upload payment proof if provided
      if (data.paymentProof) {
        try {
          paymentProofUrl = await uploadPaymentProof(tempScoutId, data.paymentProof);
          toast({
            title: "File Uploaded",
            description: "Payment proof uploaded successfully",
          });
        } catch (uploadError: any) {
          console.error("File upload failed:", uploadError);
          toast({
            title: "Upload Failed",
            description: uploadError.message || "Failed to upload payment proof",
            variant: "destructive",
          });
          // Continue with registration even if upload fails
        }
      }

      const scoutData = {
        name: data.fullName.trim(),
        uid: `BSP-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`,
        unitId: data.unit || null,
        schoolId: data.school || null,
        municipality: data.municipality,
        gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
        dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
        address: data.address,
        contactNumber: data.contactNumber,
        email: data.email || null,
        parentGuardian: data.parentGuardian || null,
        emergencyContact: data.emergencyContact || null,
        bloodType: data.bloodType || null,
        status: "pending",
        rank: data.rank || null,
        membershipYears: 0,
        profilePhoto: profilePhotoUrl,
        paymentProof: paymentProofUrl,
      };

      await createScout.mutateAsync(scoutData);
      toast({
        title: "Success",
        description: "Scout registration submitted successfully!",
      });
      setLocation("/scouts");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred while registering the scout",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Scout Registration</h1>
        <p className="text-muted-foreground">
          Register a new scout with the Boy Scouts of the Philippines
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <RegistrationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
