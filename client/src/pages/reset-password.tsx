import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Shield, CheckCircle, Lock } from "lucide-react";

export default function ResetPassword() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    // Check if we have a valid session from the reset link
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // If no session, check for hash fragments (Supabase redirect)
            if (!session) {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    // Set the session from the URL tokens
                    await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                }
            }
        };

        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.password,
            });

            if (error) throw error;

            setIsSuccess(true);
            toast({
                title: "Password Updated",
                description: "Your password has been successfully reset",
            });

            // Sign out after password reset
            await supabase.auth.signOut();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to reset password",
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
                            {isSuccess ? (
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            ) : (
                                <Lock className="h-10 w-10 text-primary" />
                            )}
                        </div>
                    </div>
                    <CardTitle className="text-2xl">
                        {isSuccess ? "Password Reset Complete" : "Reset Your Password"}
                    </CardTitle>
                    <CardDescription>
                        {isSuccess
                            ? "Your password has been successfully updated"
                            : "Enter your new password below"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-800 dark:text-green-200">
                                            Success!
                                        </p>
                                        <p className="text-green-700 dark:text-green-300 mt-1">
                                            Your password has been reset. You can now sign in with your new password.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full" onClick={() => setLocation("/login")}>
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 6 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
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

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                <button
                                    type="button"
                                    onClick={() => setLocation("/login")}
                                    className="hover:underline"
                                >
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
