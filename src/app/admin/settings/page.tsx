"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Settings,
    Save,
    Bell,
    Mail,
    Shield,
    Database,
    Globe,
    Clock,
    CheckCircle
} from "lucide-react";

export default function AdminSettingsPage() {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "EDU-BRIDGE",
        siteEmail: "admin@edubridge.com",
        academicYear: "2024-2025",
        currentSemester: "Semester 1",
        enableRegistration: true,
        requireApproval: true,
        enableEmailNotifications: true,
        enableSMSNotifications: false,
        sessionTimeout: "30",
        maxLoginAttempts: "5",
        passwordMinLength: "8",
        requireStrongPassword: true,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings");
            if (response.ok) {
                const data = await response.json();
                if (data.settings) {
                    setSettings({
                        siteName: data.settings.siteName || "EDU-BRIDGE",
                        siteEmail: data.settings.siteEmail || "admin@edubridge.com",
                        academicYear: data.settings.academicYear || "2024-2025",
                        currentSemester: data.settings.currentSemester || "Semester 1",
                        enableRegistration: data.settings.enableRegistration === "true",
                        requireApproval: data.settings.requireApproval === "true",
                        enableEmailNotifications: data.settings.enableEmailNotifications === "true",
                        enableSMSNotifications: data.settings.enableSMSNotifications === "true",
                        sessionTimeout: data.settings.sessionTimeout || "30",
                        maxLoginAttempts: data.settings.maxLoginAttempts || "5",
                        passwordMinLength: data.settings.passwordMinLength || "8",
                        requireStrongPassword: data.settings.requireStrongPassword === "true",
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings }),
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Settings className="h-8 w-8 mr-3 text-purple-600" />
                            System Settings
                        </h1>
                        <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
                    </div>
                    {saved && (
                        <div className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">Settings saved successfully</span>
                        </div>
                    )}
                </div>
            </div>

            {/* General Settings */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Globe className="h-6 w-6 mr-2 text-purple-600" />
                        General Settings
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Email</label>
                            <input
                                type="email"
                                value={settings.siteEmail}
                                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                            <input
                                type="text"
                                value={settings.academicYear}
                                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                            <select
                                value={settings.currentSemester}
                                onChange={(e) => setSettings({ ...settings, currentSemester: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="Semester 1">Semester 1</option>
                                <option value="Semester 2">Semester 2</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Settings */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Database className="h-6 w-6 mr-2 text-blue-600" />
                        Registration Settings
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Enable User Registration</p>
                            <p className="text-sm text-gray-600">Allow new users to register accounts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableRegistration}
                                onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Require Admin Approval</p>
                            <p className="text-sm text-gray-600">New registrations need admin approval</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.requireApproval}
                                onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Bell className="h-6 w-6 mr-2 text-green-600" />
                        Notification Settings
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Send notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableEmailNotifications}
                                onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-600">Send notifications via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableSMSNotifications}
                                onChange={(e) => setSettings({ ...settings, enableSMSNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Shield className="h-6 w-6 mr-2 text-red-600" />
                        Security Settings
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                            <input
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                            <input
                                type="number"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                            <input
                                type="number"
                                value={settings.passwordMinLength}
                                onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Require Strong Password</p>
                            <p className="text-sm text-gray-600">Enforce uppercase, lowercase, numbers, and special characters</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.requireStrongPassword}
                                onChange={(e) => setSettings({ ...settings, requireStrongPassword: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg px-8 disabled:opacity-50"
                >
                    <Save className="h-5 w-5 mr-2" />
                    {saving ? "Saving..." : "Save All Settings"}
                </Button>
            </div>
        </div>
    );
}
