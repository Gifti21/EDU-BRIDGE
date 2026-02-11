"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Mail,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Send,
    Shield
} from "lucide-react";

// Forgot password validation schema
const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrorMessage("");

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus("success");
            } else {
                setSubmitStatus("error");
                setErrorMessage(result.error || "Failed to send reset email. Please try again.");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
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
                    <p className="text-slate-600">Reset your password</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">Forgot Password?</CardTitle>
                        <CardDescription className="text-slate-600">
                            Enter your email address and we'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {submitStatus === "success" ? (
                            <div className="text-center space-y-6">
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Password reset instructions have been sent to your email address.
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Check your email inbox and follow the instructions to reset your password.
                                    </p>

                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-500">Didn't receive the email?</p>
                                        <Button
                                            onClick={() => setSubmitStatus("idle")}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="Enter your email address"
                                            className={`pl-11 h-12 text-base ${errors.email ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"} transition-colors`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-2 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.email.message}
                                        </p>
                                    )}
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
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending Reset Link...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Reset Link
                                        </div>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link href="/auth/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center space-y-2">
                    <div className="flex justify-center space-x-6 text-sm text-slate-600">
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
                    </div>
                    <p className="text-xs text-slate-500">
                        © 2025 EduBridge Technologies. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}