"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Lock,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Shield
} from "lucide-react";
import { passwordResetSchema, type PasswordResetInput } from "@/lib/validations/auth";

// Extract only password and confirmPassword for the form
type ResetPasswordForm = Omit<PasswordResetInput, 'token'>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(passwordResetSchema.omit({ token: true }))
    });

    useEffect(() => {
        if (!token) {
            setSubmitStatus("error");
            setErrorMessage("Invalid reset link. Please request a new password reset.");
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) return;

        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrorMessage("");

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus("success");
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else {
                setSubmitStatus("error");
                setErrorMessage(result.error || "Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setSubmitStatus("error");
            setErrorMessage("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Image
                            src="/pictures/logo.jpg"
                            alt="EduBridge Logo"
                            width={48}
                            height={48}
                            className="rounded-xl"
                        />
                        <h1 className="text-3xl font-bold text-slate-900">EduBridge</h1>
                    </div>
                    <p className="text-slate-600">Create a new password</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">Reset Password</CardTitle>
                        <CardDescription className="text-slate-600">
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {submitStatus === "success" ? (
                            <div className="text-center space-y-6">
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Password reset successful! Redirecting to login...
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        You can now login with your new password.
                                    </p>

                                    <Button
                                        onClick={() => router.push('/auth/login')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                    >
                                        Go to Login
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...register("password")}
                                            placeholder="Enter new password"
                                            className={`pl-11 pr-11 h-12 text-base ${errors.password ? "border-red-500" : "border-slate-300"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-2 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            {...register("confirmPassword")}
                                            placeholder="Confirm new password"
                                            className={`pl-11 pr-11 h-12 text-base ${errors.confirmPassword ? "border-red-500" : "border-slate-300"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600 mt-2 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-blue-900 mb-2">Password must contain:</p>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• At least 8 characters</li>
                                        <li>• One uppercase letter</li>
                                        <li>• One lowercase letter</li>
                                        <li>• One number</li>
                                        <li>• One special character</li>
                                    </ul>
                                </div>

                                {/* Error Message */}
                                {submitStatus === "error" && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-800">
                                            {errorMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !token}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Resetting Password...
                                        </div>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                Back to Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
