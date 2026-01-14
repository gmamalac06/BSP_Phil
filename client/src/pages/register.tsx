import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { scoutsService } from "@/lib/supabase-db";
import { Shield, Users, UserCheck, User, Search, ChevronLeft, ChevronRight, School, AlertTriangle, FileText } from "lucide-react";
import { useSchools } from "@/hooks/useSchools";
import { useUnits } from "@/hooks/useUnits";
import { useCreateScout } from "@/hooks/useScouts";
import { RegistrationSuccessDialog } from "@/components/registration-success-dialog";
import { RegistrationForm } from "@/components/registration-form";
import { uploadProfilePhoto, uploadPaymentProof } from "@/lib/storage";

type Role = "staff" | "unit_leader" | "scout";

const roleConfig = {
    staff: {
        icon: UserCheck,
        title: "Staff Member",
        description: "Register as a staff member to help manage scouts and activities",
        color: "bg-blue-500",
        requiresApproval: true,
        affiliationType: "school" as const,
    },
    unit_leader: {
        icon: Users,
        title: "Unit Leader",
        description: "Register as a unit leader to manage your scout unit",
        color: "bg-green-500",
        requiresApproval: true,
        affiliationType: "unit" as const,
    },
    scout: {
        icon: User,
        title: "Scout Member",
        description: "Register as a scout to join activities and track your progress",
        color: "bg-amber-500",
        requiresApproval: true,
        affiliationType: "both" as const,
    },
};

export default function Register() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [schoolSearch, setSchoolSearch] = useState("");
    const [unitSearch, setUnitSearch] = useState("");
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [registeredScoutId, setRegisteredScoutId] = useState("");
    const [registeredScoutName, setRegisteredScoutName] = useState("");

    const { data: schools = [] } = useSchools();
    const { data: units = [] } = useUnits();

    // Base registration form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        schoolId: "",
        unitId: "",
    });

    // Scout-specific form data
    const [scoutData, setScoutData] = useState({
        name: "",
        gender: "",
        municipality: "",
        dateOfBirth: "",
        address: "",
        contactNumber: "",
        parentGuardian: "",
        unitId: "",
        schoolId: "",
    });

    // Filter schools based on search
    const filteredSchools = useMemo(() => {
        if (!schoolSearch) return schools.slice(0, 50);
        return schools.filter((school) =>
            school.name.toLowerCase().includes(schoolSearch.toLowerCase())
        ).slice(0, 50);
    }, [schools, schoolSearch]);

    // Filter units based on search
    const filteredUnits = useMemo(() => {
        if (!unitSearch) return units.slice(0, 50);
        return units.filter((unit) =>
            unit.name.toLowerCase().includes(unitSearch.toLowerCase())
        ).slice(0, 50);
    }, [units, unitSearch]);

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        // For scouts, skip directly to scout details (no password step)
        if (role === "scout") {
            setStep(3); // Step 3 is scout details
        } else {
            setStep(2); // Staff/unit_leader go to password step
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedRole(null);
        } else if (step === 3) {
            // If scout, go back to role selection (step 1)
            // If staff/unit_leader, go back to password (step 2)
            if (selectedRole === "scout") {
                setStep(1);
                setSelectedRole(null);
            } else {
                setStep(2);
            }
        }
    };

    // handleNext function removed - scouts skip directly to step 3, no validation needed

    const validateStaffUnitLeader = () => {
        if (!formData.email || !formData.password || !formData.username) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return false;
        }
        if (formData.password.length < 6) {
            toast({
                title: "Weak Password",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return false;
        }

        // Staff must select a school
        if (selectedRole === "staff" && !formData.schoolId) {
            toast({
                title: "School Required",
                description: "Please select your affiliated school",
                variant: "destructive",
            });
            return false;
        }

        // Unit leader must select a unit
        if (selectedRole === "unit_leader" && !formData.unitId) {
            toast({
                title: "Unit Required",
                description: "Please select the unit you lead",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    // Use the same scout creation hook as admin
    const createScout = useCreateScout();

    // Handler for the multi-step scout registration form - exactly like admin
    const handleScoutFormSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // Generate a unique ID for the scout
            const tempScoutId = `temp-${Date.now()}`;
            const year = new Date().getFullYear();
            const random = Math.random().toString().slice(2, 8);
            const scoutUid = `BSP-${year}-${random}`;

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
                    // Continue with registration even if upload fails
                }
            }

            // Upload payment proof if provided
            if (data.paymentProof) {
                try {
                    paymentProofUrl = await uploadPaymentProof(tempScoutId, data.paymentProof);
                    toast({
                        title: "Payment Uploaded",
                        description: "Payment proof uploaded successfully",
                    });
                } catch (uploadError: any) {
                    console.error("Payment upload failed:", uploadError);
                    // Continue with registration even if upload fails
                }
            }

            // Build scout record exactly like admin's ScoutFormDialog does
            const scoutRecord = {
                uid: scoutUid,
                name: data.fullName.trim(),
                gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
                municipality: data.municipality,
                dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
                address: data.address || null,
                contactNumber: data.contactNumber || null,
                email: data.email || null,
                parentGuardian: data.parentGuardian || null,
                emergencyContact: data.emergencyContact || null,
                bloodType: data.bloodType || null,
                unitId: data.unit && data.unit !== "none" ? data.unit : null,
                schoolId: data.school && data.school !== "none" ? data.school : null,
                rank: data.rank || null,
                status: "pending",
                membershipYears: 0,
                profilePhoto: profilePhotoUrl,
                paymentProof: paymentProofUrl,
            };

            // Use the same mutation hook as admin
            await createScout.mutateAsync(scoutRecord as any);

            setRegisteredScoutId(scoutUid);
            setRegisteredScoutName(data.fullName.trim());
            setSuccessDialogOpen(true);
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.message || "Failed to create account",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // SCOUT REGISTRATION - No Supabase Auth, just scout record via API
            if (selectedRole === "scout") {
                // Validate scout data
                if (!scoutData.name || !scoutData.gender || !scoutData.municipality) {
                    throw new Error("Please fill in all required fields");
                }
                // Generate scout UID
                const year = new Date().getFullYear();
                const random = Math.random().toString().slice(2, 8);
                const scoutUid = `BSP-${year}-${random}`;
                const scoutRecord = {
                    uid: scoutUid,
                    name: scoutData.name,
                    gender: scoutData.gender,
                    municipality: scoutData.municipality,
                    dateOfBirth: scoutData.dateOfBirth ? new Date(scoutData.dateOfBirth) : null,
                    address: scoutData.address || null,
                    contactNumber: scoutData.contactNumber || null,
                    parentGuardian: scoutData.parentGuardian || null,
                    unitId: scoutData.unitId && scoutData.unitId !== "none" ? scoutData.unitId : null,
                    schoolId: scoutData.schoolId && scoutData.schoolId !== "none" ? scoutData.schoolId : null,
                    email: scoutData.contactNumber || null,
                    status: "pending",
                    membershipYears: 0,
                };
                // Use Supabase directly for scout registration
                await scoutsService.create(scoutRecord as any);

                // TODO: Send email with BSP ID to scout  
                // This will be implemented later
                setRegisteredScoutId(scoutUid);
                setRegisteredScoutName(scoutData.name);
                setSuccessDialogOpen(true);
                setIsLoading(false);
                return;
            }
            // STAFF/UNIT_LEADER REGISTRATION - With Supabase Auth
            // Validate for staff/unit_leader
            if (!validateStaffUnitLeader()) {
                setIsLoading(false);
                return;
            }
            // Validate passwords
            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match");
            }
            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }
            const username = formData.username;
            // Register user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        username: username,
                        role: selectedRole,
                        is_approved: false,
                    },
                },
            });
            if (authError) throw authError;
            if (!authData.user) {
                throw new Error("Registration failed - no user returned");
            }
            // Build user record
            const userRecord: any = {
                id: authData.user.id,
                email: formData.email,
                username: username,
                role: selectedRole,
                is_approved: false,
            };
            // Add school_id for staff
            if (selectedRole === "staff" && formData.schoolId) {
                userRecord.school_id = formData.schoolId;
            }
            // Add unit_id for unit_leader
            if (selectedRole === "unit_leader" && formData.unitId) {
                userRecord.unit_id = formData.unitId;
            }
            // Create user record in public.users table
            const { error: userError } = await supabase.from("users").insert(userRecord);
            if (userError) {
                console.error("Error creating user record:", userError);
            }
            toast({
                title: "Registration Successful!",
                description: "Your account is pending approval by an administrator. Please check your email to verify your account.",
            });
            setLocation("/login");
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.message || "Failed to create account",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    const getSelectedSchoolName = () => {
        const school = schools.find(s => s.id === formData.schoolId);
        return school?.name || "";
    };

    const getSelectedUnitName = () => {
        const unit = units.find(u => u.id === formData.unitId);
        return unit?.name || "";
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-3/10 p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Shield className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Join ScoutSmart</CardTitle>
                        <CardDescription>
                            {step === 1 && "Select your role to get started"}
                            {step === 2 && selectedRole && `Register as ${roleConfig[selectedRole].title}`}
                            {step === 3 && "Complete your scout profile"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Step 1: Role Selection */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    {(Object.keys(roleConfig) as Role[]).map((role) => {
                                        const config = roleConfig[role];
                                        const Icon = config.icon;
                                        return (
                                            <button
                                                key={role}
                                                onClick={() => handleRoleSelect(role)}
                                                className="p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                                            >
                                                <div className={`h-12 w-12 ${config.color} rounded-lg flex items-center justify-center mb-4`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className="font-semibold mb-1 group-hover:text-primary">{config.title}</h3>
                                                <p className="text-sm text-muted-foreground">{config.description}</p>
                                                {config.requiresApproval && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                                        Requires admin approval
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="text-center text-sm text-muted-foreground pt-4">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setLocation("/login")}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Account Information for Staff/Unit Leader */}
                        {step === 2 && selectedRole && selectedRole !== "scout" && (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
                                    {(() => {
                                        const Icon = roleConfig[selectedRole].icon;
                                        return <Icon className="h-5 w-5 text-muted-foreground" />;
                                    })()}
                                    <span className="text-sm">Registering as <strong>{roleConfig[selectedRole].title}</strong></span>
                                </div>

                                {/* Pending Approval Warning */}
                                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                    <div className="flex gap-2">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-800 dark:text-amber-200">
                                            <p className="font-medium">Admin Approval Required</p>
                                            <p className="mt-1">
                                                Your registration will be pending until an administrator approves your account.
                                                You will have limited access until approved.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Full Name *</Label>
                                    <Input
                                        id="username"
                                        placeholder="Your full name"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* School Selection for Staff */}
                                {selectedRole === "staff" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="staffSchool" className="flex items-center gap-2">
                                            <School className="h-4 w-4" />
                                            Your School *
                                        </Label>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Select the school you work at. You will only be able to manage scouts from this school.
                                        </p>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search for your school..."
                                                className="pl-9 mb-2"
                                                value={schoolSearch}
                                                onChange={(e) => setSchoolSearch(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <Select
                                            value={formData.schoolId}
                                            onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger id="staffSchool">
                                                <SelectValue placeholder="Select your school" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {filteredSchools.map((school) => (
                                                    <SelectItem key={school.id} value={school.id}>
                                                        {school.name}
                                                    </SelectItem>
                                                ))}
                                                {filteredSchools.length === 50 && (
                                                    <div className="px-2 py-1 text-xs text-muted-foreground">
                                                        Showing first 50 results. Use search to find more.
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Unit Selection for Unit Leader */}
                                {selectedRole === "unit_leader" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="leaderUnit" className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Your Unit *
                                        </Label>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Select the unit you lead. You will only be able to manage scouts in this unit.
                                        </p>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search for your unit..."
                                                className="pl-9 mb-2"
                                                value={unitSearch}
                                                onChange={(e) => setUnitSearch(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <Select
                                            value={formData.unitId}
                                            onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger id="leaderUnit">
                                                <SelectValue placeholder="Select your unit" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {filteredUnits.map((unit) => (
                                                    <SelectItem key={unit.id} value={unit.id}>
                                                        {unit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={isLoading}>
                                        {isLoading ? "Creating Account..." : "Submit for Approval"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 2 removed for scouts - they skip directly to step 3 (scout details) */}

                        {/* Step 3: Scout Profile using full RegistrationForm */}
                        {step === 3 && selectedRole === "scout" && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm">Registering as <strong>Scout Member</strong></span>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        <strong>Note:</strong> Your registration will be in <strong>pending</strong> status until approved by an administrator.
                                    </p>
                                </div>

                                <RegistrationForm
                                    onSubmit={handleScoutFormSubmit}
                                    isSubmitting={isLoading}
                                />

                                <div className="flex justify-start pt-4">
                                    <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Back to Role Selection
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Back to login link */}
                        {step > 1 && (
                            <div className="text-center text-sm text-muted-foreground pt-4">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setLocation("/login")}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Scout Registration Success Dialog */}
            <RegistrationSuccessDialog
                open={successDialogOpen}
                onOpenChange={setSuccessDialogOpen}
                scoutId={registeredScoutId}
                scoutName={registeredScoutName}
                onGoHome={() => {
                    setSuccessDialogOpen(false);
                    setLocation("/");
                }}
            />
        </>
    );
}
