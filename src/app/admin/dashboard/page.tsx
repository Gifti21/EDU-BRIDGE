"use client";

import { useRouter } from "next/navigation";
import { Users, UserCheck, Settings, BarChart } from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();

    const menuItems = [
        {
            title: "User Registrations",
            description: "Review and approve pending user registrations",
            icon: UserCheck,
            path: "/admin/registrations",
            color: "bg-blue-500"
        },
        {
            title: "User Management",
            description: "Manage existing users and their profiles",
            icon: Users,
            path: "/admin/users",
            color: "bg-green-500"
        },
        {
            title: "System Settings",
            description: "Configure system settings and preferences",
            icon: Settings,
            path: "/admin/settings",
            color: "bg-purple-500"
        },
        {
            title: "Reports & Analytics",
            description: "View system reports and analytics",
            icon: BarChart,
            path: "/admin/reports",
            color: "bg-orange-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your school portal</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`${item.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
