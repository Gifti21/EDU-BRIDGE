"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Clock,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    RefreshCw,
    ArrowLeft,
    Shield,
    Users
} from "lucide-react";

interface RegistrationStatus {
    id: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    firstName: string;
    lastName: string;
    role: string;
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
}

export default function PendingApprovalPage() {
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkRegistrationStatus = async () => {
        try {
            setLoading(true);

            // Get registration data from localStorage
            const registrationData = localStorage.getItem("registrationData");
            if (!registrationData) {
                setError("No registration data found. Please register first.");
                return;
            }

            const { registrationId, email } = JSON.parse(registrationData);

            // Call the API to check status
            const response = await fetch(`/api/auth/registration-status?registrationId=${registrationId}&email=${email}`);
            const result = await response.json();

            if (response.ok) {
                setRegistrationStatus(result.data);
            } else {
                setError(result.error || "Failed to check registration status");
            }
        } catch (err) {
            console.error("Status check error:", err);
            setError("Failed to check registration status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkRegistrationStatus();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Clock className="h-8 w-8 text-yellow-600" />;
            case "APPROVED":
                return <CheckCircle className="h-8 w-8 text-green-600" />;
            case "REJECTED":
                return <XCircle className="h-8 w-8 text-red-600" />;
            default:
                return <Clock className="h-8 w-8 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-50 border-yellow-200";
            case "APPROVED":
                return "bg-green-50 border-green-200";
            case "REJECTED":
                return "bg-red-50 border-red-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case "PENDING":
                return {
                    title: "Registration Under Review",
                    description: "Your registration request has been submitted and is currently being reviewed by our administrators. You will receive an email notification once your account has been approved."
                };
            case "APPROVED":
                return {
                    title: "Registration Approved!",
                    description: "Congratulations! Your account has been approved. You can now sign in to access your EduBridge portal."
                };
            case "REJECTED":
                return {
                    title: "Registration Rejected",
                    description: "Unfortunately, your registration request has been rejected. Please contact the school administration for more information or to resubmit your application."
                };
            default:
                return {
                    title: "Status Unknown",
                    description: "We're unable to determine your registration status at this time."
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <RefreshCw className="h-8 w-8 text-slate-600 animate-spin mx-auto mb-4" />
                            <p className="text-slate-600">Checking registration status...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="py-12">
                        <Alert className="border-red-200 bg-red-50">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {error}
                            </AlertDescription>
                        </Alert>
                        <div className="mt-6 text-center">
                            <Button onClick={checkRegistrationStatus} variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!registrationStatus) {
        return null;
    }

    const statusInfo = getStatusMessage(registrationStatus.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
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
                    <p className="text-slate-600">Registration Status</p>
                </div>

                <Card className={`shadow-xl border-2 ${getStatusColor(registrationStatus.status)}`}>
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {getStatusIcon(registrationStatus.status)}
                        </div>
                        <CardTitle className="text-2xl text-slate-900">
                            {statusInfo.title}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            {statusInfo.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Registration Details */}
                        <div className="bg-white rounded-lg p-6 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                Registration Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-600">Name:</span>
                                    <p className="font-medium text-slate-900">
                                        {registrationStatus.firstName} {registrationStatus.lastName}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Role:</span>
                                    <p className="font-medium text-slate-900">
                                        {registrationStatus.role.charAt(0) + registrationStatus.role.slice(1).toLowerCase()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Email:</span>
                                    <p className="font-medium text-slate-900">{registrationStatus.email}</p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Submitted:</span>
                                    <p className="font-medium text-slate-900">
                                        {new Date(registrationStatus.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {registrationStatus.status === "REJECTED" && registrationStatus.rejectionReason && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="font-medium text-red-900 mb-2">Rejection Reason:</h4>
                                    <p className="text-red-800">{registrationStatus.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        {/* Next Steps */}
                        <div className="bg-white rounded-lg p-6 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <Shield className="h-5 w-5 mr-2" />
                                What Happens Next?
                            </h3>

                            {registrationStatus.status === "PENDING" && (
                                <div className="space-y-3 text-sm text-slate-700">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                                        <p>Our administrators will review your registration within 24-48 hours</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                                        <p>You'll receive an email notification once your account is approved</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                                        <p>After approval, you can sign in using your email and password</p>
                                    </div>
                                </div>
                            )}

                            {registrationStatus.status === "APPROVED" && (
                                <div className="space-y-3 text-sm text-slate-700">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                        <p>Your account is now active and ready to use</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                        <p>Sign in with your email and password to access your dashboard</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                        <p>Complete your profile setup after your first login</p>
                                    </div>
                                </div>
                            )}

                            {registrationStatus.status === "REJECTED" && (
                                <div className="space-y-3 text-sm text-slate-700">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                                        <p>Contact the school administration for clarification</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                                        <p>You may resubmit your application with corrected information</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                                        <p>Ensure all required documents and information are provided</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-slate-600" />
                                    <div>
                                        <p className="text-slate-600">Email Support</p>
                                        <a href="mailto:medhanitmedi344@gmail.com" className="font-medium text-slate-900 hover:text-blue-600">
                                            medhanitmedi344@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4 text-slate-600" />
                                    <div>
                                        <p className="text-slate-600">Phone Support</p>
                                        <a href="tel:+251938675525" className="font-medium text-slate-900 hover:text-blue-600">
                                            +251 938 675 525
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {registrationStatus.status === "APPROVED" && (
                                <Link href="/auth/login" className="flex-1">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Sign In Now
                                    </Button>
                                </Link>
                            )}

                            {registrationStatus.status === "REJECTED" && (
                                <Link href="/auth/register" className="flex-1">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        Register Again
                                    </Button>
                                </Link>
                            )}

                            <Button
                                onClick={checkRegistrationStatus}
                                variant="outline"
                                className="flex-1"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Status
                            </Button>

                            <Link href="/" className="flex-1">
                                <Button variant="ghost" className="w-full">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}