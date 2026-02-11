"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Shield,
    Users,
    BookOpen,
    GraduationCap,
    Building
} from "lucide-react";

// Login validation schema
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginForm) => {
        setIsSubmitting(true);
        setLoginStatus("idle");
        setErrorMessage("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setLoginStatus("success");
                // Store auth token or session data
                localStorage.setItem("authToken", result.token);

                setTimeout(() => {
                    // Redirect based on user role
                    let redirectPath = "/dashboard";
                    switch (result.user.role) {
                        case "ADMINISTRATOR":
                            redirectPath = "/admin/dashboard";
                            break;
                        case "STUDENT":
                            redirectPath = "/student/dashboard";
                            break;
                        case "TEACHER":
                            redirectPath = "/teacher/dashboard";
                            break;
                        case "PARENT":
                            redirectPath = "/parent/dashboard";
                            break;
                        default:
                            redirectPath = "/dashboard";
                    }
                    router.push(redirectPath);
                }, 1500);
            } else {
                setLoginStatus("error");
                setErrorMessage(result.error || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginStatus("error");
            setErrorMessage("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleFeatures = [
        {
            icon: GraduationCap,
            title: "Students",
            description: "Access grades, assignments, and academic progress",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            icon: BookOpen,
            title: "Teachers",
            description: "Manage classes, grades, and student communications",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            icon: Users,
            title: "Parents",
            description: "Monitor child's progress and school communications",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            icon: Building,
            title: "Administrators",
            description: "Oversee school operations and user management",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/pictures/website background.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/80 to-indigo-900/85"></div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
                    <div className="absolute bottom-32 left-16 w-40 h-40 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
                    <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                </div>

                {/* Header */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Image
                                src="/pictures/logo.jpg"
                                alt="EduBridge Logo"
                                width={48}
                                height={48}
                                className="rounded-lg"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">EduBridge</h1>
                            <p className="text-blue-200">Educational Excellence Platform</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Welcome Back to Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Digital Campus
                            </span>
                        </h2>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            Access your personalized dashboard and stay connected with your educational community.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-4">
                    {roleFeatures.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                                    <IconComponent className={`h-5 w-5 ${feature.color}`} />
                                </div>
                                <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                                <p className="text-blue-200 text-xs leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="relative z-10 text-center">
                    <p className="text-blue-200 text-sm">
                        Trusted by 500+ schools worldwide • Secure & FERPA Compliant
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
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
                        <p className="text-slate-600">Sign in to your account</p>
                    </div>

                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-6">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
                            <CardDescription className="text-slate-600">
                                Sign in to access your EduBridge dashboard
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
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

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...register("password")}
                                            placeholder="Enter your password"
                                            className={`pl-11 pr-11 h-12 text-base ${errors.password ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"} transition-colors`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
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

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("rememberMe")}
                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">Remember me</span>
                                    </label>
                                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Status Messages */}
                                {loginStatus === "success" && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            Login successful! Redirecting to your dashboard...
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {loginStatus === "error" && (
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
                                            Signing In...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            Sign In
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </Button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-500">New to EduBridge?</span>
                                    </div>
                                </div>

                                {/* Register Link */}
                                <div className="text-center">
                                    <Link href="/auth/register">
                                        <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-base transition-all duration-300">
                                            Create New Account
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-2">
                        <div className="flex justify-center space-x-6 text-sm text-slate-600">
                            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
                            <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
                        </div>
                        <p className="text-xs text-slate-500">
                            © 2025 EduBridge Technologies. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}