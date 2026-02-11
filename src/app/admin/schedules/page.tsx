"use client";

import { Calendar } from "lucide-react";

export default function SchedulesPage() {
    return (
        <div className="p-6">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-12 shadow-xl text-center">
                <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedules Management</h1>
                <p className="text-gray-600">Coming soon - Manage class schedules and timetables</p>
            </div>
        </div>
    );
}
