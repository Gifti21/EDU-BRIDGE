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

    const gradeLevels = ["KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

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
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
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
                        <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                            <Download className="h-5 w-5 mr-2" />
                            Export
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg">
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
                                                <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-colors" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Course">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete Course">
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
        </div>
    );
}
