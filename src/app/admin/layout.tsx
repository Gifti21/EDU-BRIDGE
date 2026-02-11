"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Users,
    BookOpen,
    Calendar,
    UserCheck,
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    ClipboardList
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple client-side check - server-side protection is in API routes
        setLoading(false);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Enrollments', href: '/admin/enrollments', icon: GraduationCap },
        { name: 'Schedules', href: '/admin/schedules', icon: Calendar },
        { name: 'Teachers', href: '/admin/teachers', icon: UserCheck },
        { name: 'Reports', href: '/admin/reports', icon: ClipboardList },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo with gradient background */}
                    <div className="relative h-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                        <div className="relative flex items-center justify-between h-full">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Image
                                        src="/pictures/logo.jpg"
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className="rounded-xl shadow-lg ring-2 ring-white/50"
                                    />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-white block">Admin Panel</span>
                                    <span className="text-xs text-white/80">Management System</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation with enhanced styling */}
                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item, index) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${isActive
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className={`p-2 rounded-lg mr-3 transition-all ${isActive
                                        ? 'bg-white/20'
                                        : 'bg-gray-100 group-hover:bg-white'
                                        }`}>
                                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                                    </div>
                                    <span className="flex-1">{item.name}</span>
                                    {isActive && (
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Enhanced logout button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Enhanced Top bar with glassmorphism */}
                <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 shadow-lg border-b border-gray-200/50">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Top bar content */}
                        <div className="flex-1 flex items-center justify-end space-x-4">
                            {/* Search bar */}
                            <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-64 hover:bg-gray-200 transition-colors">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm text-gray-700 w-full"
                                />
                            </div>

                            {/* Notification bell */}
                            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            </button>

                            {/* User profile */}
                            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    A
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main>
                    {children}
                </main>
            </div>

            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                nav a {
                    animation: slideIn 0.3s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
