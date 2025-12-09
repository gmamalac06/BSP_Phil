import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Upload, CheckCircle2 } from "lucide-react";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { validateFile } from "@/lib/storage";

interface RegistrationFormProps {
  onSubmit?: (data: any) => void;
  isSubmitting?: boolean;
}

export function RegistrationForm({ onSubmit, isSubmitting = false }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const { data: schools = [], isLoading: schoolsLoading } = useSchools();
  const { data: units = [], isLoading: unitsLoading } = useUnits();

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    address: "",
    municipality: "",
    contactNumber: "",
    email: "",
    parentGuardian: "",
    emergencyContact: "",
    bloodType: "",
    school: "",
    unit: "",
    rank: "",
    profilePhoto: null as File | null,
    paymentProof: null as File | null,
  });

  const [fileError, setFileError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setFileError(validation.error || "Invalid file");
        updateField("paymentProof", null);
        return;
      }

      setFileError(null);
      updateField("paymentProof", file);
      console.log("Payment proof uploaded:", file.name);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate photo (only images, max 5MB)
      const validation = validateFile(file, 5, ['image/jpeg', 'image/png', 'image/jpg']);
      if (!validation.valid) {
        setPhotoError(validation.error || "Invalid file");
        updateField("profilePhoto", null);
        return;
      }

      setPhotoError(null);
      updateField("profilePhoto", file);
      console.log("Profile photo uploaded:", file.name);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onSubmit?.(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scout Registration</CardTitle>
        <CardDescription>Step {step} of 4</CardDescription>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"
                }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Enter your complete name"
                data-testid="input-full-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                  data-testid="input-birth-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                  <SelectTrigger id="gender" data-testid="select-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type *</Label>
              <Select value={formData.bloodType} onValueChange={(v) => updateField("bloodType", v)}>
                <SelectTrigger id="bloodType" data-testid="select-blood-type">
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
              <Label htmlFor="profilePhoto">Profile Photo (2x2 ID Picture) *</Label>
              <div className={`border-2 border-dashed rounded-md p-6 text-center hover:bg-muted/50 transition-colors ${photoError ? "border-destructive" : formData.profilePhoto ? "border-green-500" : ""
                }`}>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                  data-testid="input-profile-photo"
                />
                <Label
                  htmlFor="profilePhoto"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  {formData.profilePhoto ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {formData.profilePhoto.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Click to change photo
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">Upload Profile Photo</span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG (Max 5MB) - 2x2 ID picture
                      </span>
                    </>
                  )}
                </Label>
                {photoError && (
                  <p className="text-sm text-destructive mt-2">{photoError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                data-testid="input-address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipality *</Label>
              <Input
                id="municipality"
                value={formData.municipality}
                onChange={(e) => updateField("municipality", e.target.value)}
                data-testid="input-municipality"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => updateField("contactNumber", e.target.value)}
                data-testid="input-contact"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentGuardian">Parent/Guardian Name</Label>
              <Input
                id="parentGuardian"
                value={formData.parentGuardian}
                onChange={(e) => updateField("parentGuardian", e.target.value)}
                placeholder="Full name of parent or guardian"
                data-testid="input-parent-guardian"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Number *</Label>
              <Input
                id="emergencyContact"
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => updateField("emergencyContact", e.target.value)}
                placeholder="+63 XXX XXX XXXX"
                data-testid="input-emergency-contact"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school">School *</Label>
              <Select value={formData.school} onValueChange={(v) => updateField("school", v)}>
                <SelectTrigger id="school" data-testid="select-school">
                  <SelectValue placeholder={schoolsLoading ? "Loading schools..." : "Select school"} />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(v) => updateField("unit", v)}>
                <SelectTrigger id="unit" data-testid="select-unit">
                  <SelectValue placeholder={unitsLoading ? "Loading units..." : "Select unit"} />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank">Current Rank</Label>
              <Select value={formData.rank} onValueChange={(v) => updateField("rank", v)}>
                <SelectTrigger id="rank" data-testid="select-rank">
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
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentProof">Payment Proof *</Label>
              <div className={`border-2 border-dashed rounded-md p-6 text-center hover-elevate active-elevate-2 ${fileError ? "border-destructive" : formData.paymentProof ? "border-green-500" : ""
                }`}>
                <Input
                  id="paymentProof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-payment-proof"
                />
                <Label
                  htmlFor="paymentProof"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  {formData.paymentProof ? (
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${formData.paymentProof ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                    {formData.paymentProof
                      ? formData.paymentProof.name
                      : "Click to upload payment proof"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                  </span>
                </Label>
              </div>
              {fileError && (
                <p className="text-sm text-destructive">{fileError}</p>
              )}
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Registration Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {formData.fullName}</p>
                <p><span className="text-muted-foreground">School:</span> {formData.school}</p>
                <p><span className="text-muted-foreground">Unit:</span> {formData.unit}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            data-testid="button-previous"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              data-testid="button-next"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} data-testid="button-submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
