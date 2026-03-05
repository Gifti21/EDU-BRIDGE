"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DollarSign,
    TrendingUp,
    Users,
    FileText,
    Bell,
    Settings,
    LogOut,
    Download,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle,
    CreditCard,
    BarChart3
} from "lucide-react";

export default function FinancerDashboard() {
    const totalRevenue = 125000;
    const pendingPayments = 15;
    const completedPayments = 85;
    const overduePayments = 5;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Image
                                src="/pictures/logo.jpg"
                                alt="EduBridge Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Finance Portal</h1>
                                <p className="text-gray-600">Financial Management Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                        <DollarSign className="h-10 w-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">Financial Overview</h2>
                                        <p className="text-emerald-100 text-lg">
                                            Manage payments, billing, and financial reports
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 rounded-lg p-4">
                                        <p className="text-emerald-100 text-sm">Total Revenue</p>
                                        <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                                    <p className="text-3xl font-bold text-yellow-600">{pendingPayments}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{completedPayments}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                                    <p className="text-3xl font-bold text-red-600">{overduePayments}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                    <p className="text-3xl font-bold text-blue-600">250</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Frequently used financial management tools
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <span className="text-sm">Verify Payments</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                    <span className="text-sm">Generate Reports</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <CreditCard className="h-6 w-6 text-purple-600" />
                                    <span className="text-sm">Manage Billing</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Download className="h-6 w-6 text-orange-600" />
                                    <span className="text-sm">Export Data</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card className="bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
                            Recent Transactions
                        </CardTitle>
                        <CardDescription>
                            Latest payment activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>Financial data will be displayed here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
