"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    Clock,
    AlertCircle,
    Calendar,
    UserCheck,
    ArrowRight,
    Activity,
    BarChart3,
    DollarSign,
    Bell,
    Zap,
    CheckCircle2
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        pendingApprovals: 0,
        activeUsers: 0,
        revenue: 0,
        attendance: 0,
        recentActivity: [] as any[]
    });
    const [loading, setLoading] = useState(true);
    const [animatedStats, setAnimatedStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        revenue: 0,
        attendance: 0,
    });

    useEffect(() => {
        // Simulate loading with animation
        setTimeout(() => {
            const finalStats = {
                totalUsers: 1250,
                totalStudents: 850,
                totalTeachers: 45,
                totalCourses: 32,
                totalEnrollments: 2340,
                pendingApprovals: 12,
                activeUsers: 1180,
                revenue: 125000,
                attendance: 94.5,
                recentActivity: [
                    { type: 'success', message: 'John Doe enrolled in Mathematics', time: '5 min ago', icon: 'check' },
                    { type: 'info', message: 'New teacher Sarah Smith registered', time: '15 min ago', icon: 'user' },
                    { type: 'warning', message: 'Physics course needs review', time: '1 hour ago', icon: 'alert' },
                    { type: 'success', message: '25 students completed assignments', time: '2 hours ago', icon: 'check' },
                ]
            };
            setStats(finalStats);
            setLoading(false);

            // Animate numbers counting up
            const duration = 2000;
            const steps = 60;
            const interval = duration / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setAnimatedStats({
                    totalUsers: Math.floor(finalStats.totalUsers * progress),
                    totalStudents: Math.floor(finalStats.totalStudents * progress),
                    totalTeachers: Math.floor(finalStats.totalTeachers * progress),
                    totalCourses: Math.floor(finalStats.totalCourses * progress),
                    revenue: Math.floor(finalStats.revenue * progress),
                    attendance: parseFloat((finalStats.attendance * progress).toFixed(1)),
                });

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedStats({
                        totalUsers: finalStats.totalUsers,
                        totalStudents: finalStats.totalStudents,
                        totalTeachers: finalStats.totalTeachers,
                        totalCourses: finalStats.totalCourses,
                        revenue: finalStats.revenue,
                        attendance: finalStats.attendance,
                    });
                }
            }, interval);

            return () => clearInterval(timer);
        }, 1500);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-cyan-900 to-indigo-900">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
                    <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-0"></div>
                </div>
                <div className="text-center z-10">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mx-auto"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-white opacity-20 mx-auto"></div>
                    </div>
                    <p className="mt-6 text-white text-xl font-semibold animate-pulse">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-900 via-cyan-900 to-indigo-900">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
                    <div className="absolute w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-0"></div>
                    <div className="absolute w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-6000 top-1/2 left-1/2"></div>
                </div>
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative z-10 p-6 space-y-6">
                {/* Welcome Header with Glassmorphism */}
                <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
                                Welcome Back, Admin
                            </h1>
                            <p className="text-gray-700 text-lg">Here's what's happening with your school today</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button className="bg-gray-100 hover:bg-gray-200 backdrop-blur-lg border border-gray-300 text-gray-900">
                                <Bell className="h-5 w-5 mr-2" />
                                Notifications
                                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                            </Button>
                            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">
                                <Zap className="h-5 w-5 mr-2" />
                                Quick Actions
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="group backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex items-center space-x-1 text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-semibold">+12%</span>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
                        <p className="text-4xl font-bold text-gray-900 mb-2 transition-all duration-300">{animatedStats.totalUsers.toLocaleString()}</p>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    {/* Students */}
                    <div className="group backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex items-center space-x-1 text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-semibold">+8%</span>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Active Students</h3>
                        <p className="text-4xl font-bold text-gray-900 mb-2 transition-all duration-300">{animatedStats.totalStudents.toLocaleString()}</p>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full animate-pulse" style={{ width: '85%' }}></div>
                        </div>
                    </div>

                    {/* Courses */}
                    <div className="group backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex items-center space-x-1 text-blue-600">
                                <Activity className="h-4 w-4" />
                                <span className="text-sm font-semibold">{stats.totalEnrollments}</span>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Active Courses</h3>
                        <p className="text-4xl font-bold text-gray-900 mb-2 transition-all duration-300">{animatedStats.totalCourses}</p>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="group backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform animate-pulse">
                                <Clock className="h-8 w-8 text-white" />
                            </div>
                            <Link href="/admin/users" className="text-orange-600 hover:text-orange-700 text-sm font-semibold flex items-center">
                                Review
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Approvals</h3>
                        <p className="text-4xl font-bold text-gray-900 mb-2">{stats.pendingApprovals}</p>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" style={{ width: '30%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue */}
                    <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">${animatedStats.revenue.toLocaleString()}</p>
                                <div className="flex items-center mt-2 text-green-600 text-sm">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    <span>+15.3% from last month</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl">
                                <div className="text-white text-3xl font-bold">$</div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Attendance Rate</p>
                                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{animatedStats.attendance}%</p>
                                <div className="flex items-center mt-2 text-green-600 text-sm">
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    <span>Excellent performance</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl">
                                <UserCheck className="h-10 w-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Teachers */}
                    <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Active Teachers</p>
                                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{animatedStats.totalTeachers}</p>
                                <div className="flex items-center mt-2 text-purple-600 text-sm">
                                    <span className="mr-1">✓</span>
                                    <span>All verified</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl">
                                <div className="text-white text-3xl font-bold">★</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - Large Buttons */}
                <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="text-yellow-500 text-2xl mr-2">⚡</span>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/admin/users">
                            <div className="group backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-400/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="bg-blue-500 p-4 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-gray-900 font-semibold">Manage Users</p>
                            </div>
                        </Link>
                        <Link href="/admin/courses">
                            <div className="group backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30 border border-green-400/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="bg-green-500 p-4 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-gray-900 font-semibold">Manage Courses</p>
                            </div>
                        </Link>
                        <Link href="/admin/enrollments">
                            <div className="group backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="bg-purple-500 p-4 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-gray-900 font-semibold">Enrollments</p>
                            </div>
                        </Link>
                        <Link href="/admin/schedules">
                            <div className="group backdrop-blur-lg bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/30 hover:to-red-600/30 border border-orange-400/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="bg-orange-500 p-4 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform">
                                    <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-gray-900 font-semibold">Schedules</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="text-blue-500 text-2xl mr-2">📊</span>
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity: any, index: number) => (
                                <div key={index} className="backdrop-blur-lg bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-lg ${activity.type === 'success' ? 'bg-green-100 border border-green-300' :
                                            activity.type === 'warning' ? 'bg-orange-100 border border-orange-300' :
                                                'bg-blue-100 border border-blue-300'
                                            }`}>
                                            {activity.icon === 'check' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                            {activity.icon === 'user' && <Users className="h-5 w-5 text-blue-600" />}
                                            {activity.icon === 'alert' && <AlertCircle className="h-5 w-5 text-orange-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">{activity.message}</p>
                                            <p className="text-gray-600 text-sm mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/admin/reports">
                            <Button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900">
                                View All Activity
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* System Overview */}
                    <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="text-purple-500 text-2xl mr-2">📈</span>
                            System Overview
                        </h2>
                        <div className="space-y-4">
                            <div className="backdrop-blur-lg bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-900 font-medium">Active Users</span>
                                    <span className="text-2xl font-bold text-gray-900">{stats.activeUsers}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>

                            <div className="backdrop-blur-lg bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-900 font-medium">Total Enrollments</span>
                                    <span className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full" style={{ width: '87%' }}></div>
                                </div>
                            </div>

                            <div className="backdrop-blur-lg bg-purple-50 border border-purple-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-900 font-medium">Course Completion</span>
                                    <span className="text-2xl font-bold text-gray-900">78%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>

                            <div className="backdrop-blur-lg bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-900 font-medium">Pending Actions</span>
                                    <span className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-orange-400 to-red-600 rounded-full animate-pulse" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/reports">
                            <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Detailed Reports
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 20s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-6000 {
                    animation-delay: 6s;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                @keyframes fade-in-up {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
