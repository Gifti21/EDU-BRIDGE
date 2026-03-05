"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Search,
    Plus,
    Edit,
    Trash2,
    Users,
    Calendar,
    Clock,
    GraduationCap,
    X,
    Eye,
    Award,
    Download
} from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    description: string;
    gradeLevel: string;
    subject: string;
    hoursPerWeek: number;
    teacher: string;
    academicYear: string;
    semester: string;
    status: string;
}

export default function CoursesManagementPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGrade, setFilterGrade] = useState("all");
    const [filterSemester, setFilterSemester] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: "",
        gradeLevel: "Grade 1",
        subject: "",
        hoursPerWeek: 5,
        teacher: "",
        academicYear: "2024-2025",
        semester: "Semester 1"
    });

    const gradeLevels = ["KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

    const handleExport = () => {
        const csvContent = [
            ["Course Code", "Course Name", "Description", "Grade Level", "Subject", "Hours/Week", "Teacher", "Academic Year", "Semester", "Status"],
            ...courses.map(c => [
                c.code || "",
                c.name || "",
                c.description || "",
                c.gradeLevel || "",
                c.subject || "",
                c.hoursPerWeek || "",
                c.teacher || "",
                c.academicYear || "",
                c.semester || "",
                c.status || ""
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `courses-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        setTimeout(() => {
            setCourses([
                { id: "1", code: "MATH-G1-S1", name: "Mathematics", description: "Basic arithmetic and number concepts", gradeLevel: "Grade 1", subject: "Mathematics", hoursPerWeek: 5, teacher: "Jane Smith", academicYear: "2024-2025", semester: "Semester 1", status: "ACTIVE" },
                { id: "2", code: "ENG-G1-S1", name: "English Language", description: "Reading, writing, and basic grammar", gradeLevel: "Grade 1", subject: "English", hoursPerWeek: 5, teacher: "John Doe", academicYear: "2024-2025", semester: "Semester 1", status: "ACTIVE" },
                { id: "3", code: "SCI-G2-S1", name: "General Science", description: "Introduction to natural sciences", gradeLevel: "Grade 2", subject: "Science", hoursPerWeek: 4, teacher: "Alice Williams", academicYear: "2024-2025", semester: "Semester 1", status: "ACTIVE" },
                { id: "4", code: "MATH-G2-S1", name: "Mathematics", description: "Addition, subtraction, and basic geometry", gradeLevel: "Grade 2", subject: "Mathematics", hoursPerWeek: 5, teacher: "Jane Smith", academicYear: "2024-2025", semester: "Semester 1", status: "ACTIVE" },
                { id: "5", code: "AMH-KG-S1", name: "Amharic", description: "Basic Amharic alphabet and words", gradeLevel: "KG", subject: "Amharic", hoursPerWeek: 3, teacher: "Bob Johnson", academicYear: "2024-2025", semester: "Semester 1", status: "ACTIVE" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = (course.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (course.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (course.teacher?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesGrade = filterGrade === "all" || course.gradeLevel === filterGrade;
        const matchesSemester = filterSemester === "all" || course.semester === filterSemester;
        return matchesSearch && matchesGrade && matchesSemester;
    });

    const coursesByGrade = gradeLevels.map(grade => ({
        grade,
        courses: filteredCourses.filter(c => c.gradeLevel === grade)
    })).filter(g => g.courses.length > 0);

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
                            <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                            Course Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage courses for KG to Grade 12 - Academic Year 2024-2025</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button onClick={handleExport} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                            <Download className="h-5 w-5 mr-2" />
                            Export
                        </Button>
                        <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg">
                            <Plus className="h-5 w-5 mr-2" />
                            Add Course
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Grades</option>
                        {gradeLevels.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                        ))}
                    </select>
                    <select
                        value={filterSemester}
                        onChange={(e) => setFilterSemester(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Semesters</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Grade Levels</p>
                            <p className="text-2xl font-bold text-green-600">{coursesByGrade.length}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Subjects</p>
                            <p className="text-2xl font-bold text-purple-600">{new Set(courses.map(c => c.subject)).size}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Award className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Hours/Week</p>
                            <p className="text-2xl font-bold text-orange-600">{courses.reduce((sum, c) => sum + c.hoursPerWeek, 0)}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses by Grade Level */}
            {coursesByGrade.map((gradeGroup) => (
                <div key={gradeGroup.grade} className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                            {gradeGroup.grade}
                            <span className="ml-3 text-sm font-normal text-gray-600">({gradeGroup.courses.length} courses)</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours/Week</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {gradeGroup.courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{course.code}</div>
                                                    <div className="text-sm text-gray-500">{course.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full border border-purple-200">
                                                {course.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.teacher}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.hoursPerWeek} hrs</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">
                                                {course.semester}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => { setSelectedCourse(course); setFormData({ code: course.code, name: course.name, description: course.description, gradeLevel: course.gradeLevel, subject: course.subject, hoursPerWeek: course.hoursPerWeek, teacher: course.teacher, academicYear: course.academicYear, semester: course.semester }); setShowEditModal(true); }}
                                                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedCourse(course); setShowDeleteModal(true); }}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {filteredCourses.length === 0 && (
                <div className="bg-white/90 border border-gray-200 rounded-xl p-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No courses found matching your criteria</p>
                </div>
            )}

            {/* Create Course Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Add New Course</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                                    <select value={formData.gradeLevel} onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        {gradeLevels.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week *</label>
                                    <input type="number" value={formData.hoursPerWeek} onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                                    <input type="text" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                            <Button onClick={() => setShowCreateModal(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                            <Button onClick={() => { setCourses([...courses, { id: String(courses.length + 1), ...formData, status: "ACTIVE" }]); setShowCreateModal(false); }} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">Create Course</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Course Modal */}
            {showEditModal && selectedCourse && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Edit Course</h2>
                                <button onClick={() => setShowEditModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                                    <select value={formData.gradeLevel} onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        {gradeLevels.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week *</label>
                                    <input type="number" value={formData.hoursPerWeek} onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                                    <input type="text" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                            <Button onClick={() => setShowEditModal(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                            <Button onClick={() => { setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...formData } : c)); setShowEditModal(false); }} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Course Modal */}
            {showDeleteModal && selectedCourse && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Course</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold">{selectedCourse.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex items-center space-x-3">
                                <Button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                                <Button onClick={() => { setCourses(courses.filter(c => c.id !== selectedCourse.id)); setShowDeleteModal(false); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
