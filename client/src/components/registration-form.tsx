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
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";

interface RegistrationFormProps {
  onSubmit?: (data: any) => void;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    gender: "",
    address: "",
    municipality: "",
    contactNumber: "",
    email: "",
    school: "",
    unit: "",
    rank: "",
    paymentProof: null as File | null,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("paymentProof", file);
      console.log("Payment proof uploaded:", file.name);
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
              className={`h-2 flex-1 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  data-testid="input-last-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
                data-testid="input-middle-name"
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
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school">School *</Label>
              <Select value={formData.school} onValueChange={(v) => updateField("school", v)}>
                <SelectTrigger id="school" data-testid="select-school">
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manila-science">Manila Science High School</SelectItem>
                  <SelectItem value="qc-high">Quezon City High School</SelectItem>
                  <SelectItem value="makati-high">Makati High School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(v) => updateField("unit", v)}>
                <SelectTrigger id="unit" data-testid="select-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eagle">Eagle Patrol</SelectItem>
                  <SelectItem value="phoenix">Phoenix Patrol</SelectItem>
                  <SelectItem value="falcon">Falcon Patrol</SelectItem>
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
              <div className="border-2 border-dashed rounded-md p-6 text-center hover-elevate active-elevate-2">
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
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.paymentProof
                      ? formData.paymentProof.name
                      : "Click to upload payment proof"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, PDF
                  </span>
                </Label>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Registration Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</p>
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
            <Button onClick={handleSubmit} data-testid="button-submit">
              Submit Registration
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
