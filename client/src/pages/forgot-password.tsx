import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setEmailSent(true);
            toast({
                title: "Email Sent",
                description: "Check your inbox for the password reset link",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-3/10 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            {emailSent ? (
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            ) : (
                                <Shield className="h-10 w-10 text-primary" />
                            )}
                        </div>
                    </div>
                    <CardTitle className="text-2xl">
                        {emailSent ? "Check Your Email" : "Forgot Password"}
                    </CardTitle>
                    <CardDescription>
                        {emailSent
                            ? "We've sent a password reset link to your email address"
                            : "Enter your email address and we'll send you a link to reset your password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {emailSent ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-800 dark:text-green-200">
                                            Email sent to {email}
                                        </p>
                                        <p className="text-green-700 dark:text-green-300 mt-1">
                                            Click the link in the email to reset your password. The link will expire in 1 hour.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <p>Didn't receive the email?</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Check your spam or junk folder</li>
                                    <li>Make sure you entered the correct email</li>
                                    <li>Wait a few minutes and try again</li>
                                </ul>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setEmailSent(false);
                                        setEmail("");
                                    }}
                                >
                                    Try Different Email
                                </Button>
                                <Button className="flex-1" onClick={() => setLocation("/login")}>
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setLocation("/login")}
                                    className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
