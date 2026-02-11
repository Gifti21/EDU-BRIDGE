"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Shield,
    Lock,
    User,
    AlertCircle,
    CheckCircle
} from "lucide-react";

export default function AdminLoginPage() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Simple admin authentication (in production, use proper authentication)
        if (credentials.username === "admin" && credentials.password === "admin123") {
            // Store admin session (in production, use proper JWT/session management)
            localStorage.setItem("adminAuth", "true");
            router.push("/admin/dashboard");
        } else {
            setError("Invalid admin credentials");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Image
                                src="/pictures/logo.jpg"
                                alt="EduBridge Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold text-slate-900">EduBridge</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">Admin Access</CardTitle>
                        <CardDescription className="text-slate-600">
                            Sign in to access the administration dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Admin Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                                        placeholder="Enter admin username"
                                        className="pl-11 h-12 text-base border-slate-300 focus:border-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Admin Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Enter admin password"
                                        className="pl-11 h-12 text-base border-slate-300 focus:border-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {isSubmitting ? "Signing In..." : "Access Dashboard"}
                            </Button>
                        </form>

                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <h4 className="text-sm font-semibold text-amber-800 mb-2">Demo Credentials:</h4>
                            <p className="text-xs text-amber-700">
                                Username: <code className="bg-amber-100 px-1 rounded">admin</code><br />
                                Password: <code className="bg-amber-100 px-1 rounded">admin123</code>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500">
                                Authorized personnel only. All access is logged and monitored.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}