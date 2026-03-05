"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    UserCheck,
    Search,
    Mail,
    Phone,
    BookOpen,
    Award,
    Download,
    Edit,
    Trash2,
    Plus,
    X
} from "lucide-react";

interface Teacher {
    id: string;
    name: string;
    email: string;
    phone?: string;
    specialization?: string;
    coursesCount: number;
    status: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setTimeout(() => {
            setTeachers([
                { id: "1", name: "Jane Smith", email: "math.teacher@greenwood.edu", phone: "+251922345678", specialization: "Mathematics", coursesCount: 3, status: "ACTIVE" },
                { id: "2", name: "John Doe", email: "english.teacher@greenwood.edu", phone: "+251933456789", specialization: "English", coursesCount: 2, status: "ACTIVE" },
                { id: "3", name: "Alice Williams", email: "science.teacher@greenwood.edu", phone: "+251944567890", specialization: "Science", coursesCount: 4, status: "ACTIVE" },
                { id: "4", name: "Bob Johnson", email: "amharic.teacher@greenwood.edu", phone: "+251955678901", specialization: "Amharic", coursesCount: 2, status: "ACTIVE" },
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleExport = () => {
        const csvContent = [
            ["Name", "Email", "Phone", "Specialization", "Courses", "Status"],
            ...teachers.map(t => [
                t.name || "",
                t.email || "",
                t.phone || "",
                t.specialization || "",
                t.coursesCount || "",
                t.status || ""
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `teachers-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredTeachers = teachers.filter(teacher =>
        (teacher.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (teacher.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (teacher.specialization?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                            <UserCheck className="h-8 w-8 mr-3 text-blue-600" />
                            Teachers Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage teacher profiles and course assignments</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button onClick={handleExport} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                            <Download className="h-5 w-5 mr-2" />
                            Export
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg">
                            <Plus className="h-5 w-5 mr-2" />
                            Add Teacher
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teachers by name, email, or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Teachers</p>
                            <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <UserCheck className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Teachers</p>
                            <p className="text-2xl font-bold text-green-600">{teachers.filter(t => t.status === "ACTIVE").length}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Award className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Courses</p>
                            <p className="text-2xl font-bold text-purple-600">{teachers.reduce((sum, t) => sum + t.coursesCount, 0)}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                {teacher.name?.charAt(0) || "?"}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{teacher.name || "N/A"}</div>
                                                <div className="text-sm text-gray-500">{teacher.email || "N/A"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full border border-purple-200">
                                            {teacher.specialization || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {teacher.phone && (
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                                    {teacher.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
                                            <span className="text-sm text-gray-900">{teacher.coursesCount} courses</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => { setSelectedTeacher(teacher); setShowViewModal(true); }}
                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <BookOpen className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="Edit Teacher"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTeachers.length === 0 && (
                    <div className="text-center py-12">
                        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No teachers found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* View Teacher Modal */}
            {showViewModal && selectedTeacher && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Teacher Details</h2>
                                <button onClick={() => setShowViewModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                                    {selectedTeacher.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedTeacher.name || "N/A"}</h3>
                                    <p className="text-gray-600">{selectedTeacher.email || "N/A"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Specialization</p>
                                    <p className="font-medium text-gray-900">{selectedTeacher.specialization || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                                    <p className="font-medium text-gray-900">{selectedTeacher.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Courses Assigned</p>
                                    <p className="font-medium text-gray-900">{selectedTeacher.coursesCount} courses</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className="px-3 py-1 inline-flex text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                        {selectedTeacher.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                            <Button onClick={() => setShowViewModal(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
