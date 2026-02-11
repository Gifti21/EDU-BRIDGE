"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BookOpen,
    Users,
    Calendar,
    ClipboardCheck,
    TrendingUp,
    MessageSquare,
    FileText,
    Award,
    Bell,
    Settings,
    LogOut,
    Plus,
    Eye,
    Edit,
    BarChart3,
    Clock
} from "lucide-react";

interface TeacherData {
    name: string;
    teacherId: string;
    department: string;
    subjects: string[];
}

interface ClassData {
    id: string;
    name: string;
    grade: string;
    section: string;
    students: number;
    subject: string;
}

interface Assignment {
    id: string;
    title: string;
    class: string;
    dueDate: string;
    submissions: number;
    totalStudents: number;
}

export default function TeacherDashboard() {
    const [teacherData, setTeacherData] = useState<TeacherData>({
        name: "Dr. Sarah Johnson",
        teacherId: "TCH2025001",
        department: "Mathematics",
        subjects: ["Algebra", "Geometry", "Calculus"]
    });

    const [classes, setClasses] = useState<ClassData[]>([
        { id: "1", name: "Mathematics", grade: "10th", section: "A", students: 32, subject: "Algebra" },
        { id: "2", name: "Mathematics", grade: "10th", section: "B", students: 28, subject: "Algebra" },
        { id: "3", name: "Advanced Math", grade: "11th", section: "A", students: 25, subject: "Calculus" },
        { id: "4", name: "Geometry", grade: "9th", section: "C", students: 30, subject: "Geometry" }
    ]);

    const [assignments, setAssignments] = useState<Assignment[]>([
        { id: "1", title: "Quadratic Equations Quiz", class: "10th A", dueDate: "2025-01-15", submissions: 28, totalStudents: 32 },
        { id: "2", title: "Geometry Problem Set", class: "9th C", dueDate: "2025-01-18", submissions: 15, totalStudents: 30 },
        { id: "3", title: "Calculus Integration Test", class: "11th A", dueDate: "2025-01-20", submissions: 20, totalStudents: 25 }
    ]);

    const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
    const totalAssignments = assignments.length;
    const pendingGrading = assignments.reduce((sum, assignment) => sum + assignment.submissions, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
                                <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
                                <p className="text-gray-600">Welcome back, {teacherData.name}</p>
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
                    <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                        <BookOpen className="h-10 w-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">Welcome back, {teacherData.name}!</h2>
                                        <p className="text-green-100 text-lg">
                                            {teacherData.department} Department • ID: {teacherData.teacherId}
                                        </p>
                                        <p className="text-green-200 mt-2">
                                            Ready to inspire minds today? You have {pendingGrading} submissions waiting for review.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 rounded-lg p-4">
                                        <p className="text-green-100 text-sm">Total Students</p>
                                        <p className="text-3xl font-bold">{totalStudents}</p>
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
                                    <p className="text-sm font-medium text-gray-600">My Classes</p>
                                    <p className="text-3xl font-bold text-blue-600">{classes.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                    <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Grading</p>
                                    <p className="text-3xl font-bold text-orange-600">{pendingGrading}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <ClipboardCheck className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                                    <p className="text-3xl font-bold text-purple-600">{totalAssignments}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* My Classes */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-green-600" />
                                        My Classes
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your classes and students
                                    </CardDescription>
                                </div>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Class
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {classes.map((classItem) => (
                                        <div key={classItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <BookOpen className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {classItem.name} - {classItem.grade} {classItem.section}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{classItem.subject}</p>
                                                    <p className="text-xs text-gray-500">{classItem.students} students</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <BarChart3 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Assignments */}
                    <div>
                        <Card className="bg-white shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-orange-600" />
                                        Recent Assignments
                                    </CardTitle>
                                    <CardDescription>
                                        Track assignment submissions
                                    </CardDescription>
                                </div>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">{assignment.title}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{assignment.class}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                <span>{assignment.submissions}/{assignment.totalStudents} submitted</span>
                                            </div>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Frequently used teaching tools and features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <ClipboardCheck className="h-6 w-6 text-blue-600" />
                                    <span className="text-sm">Take Attendance</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <FileText className="h-6 w-6 text-green-600" />
                                    <span className="text-sm">Create Assignment</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Award className="h-6 w-6 text-purple-600" />
                                    <span className="text-sm">Grade Submissions</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <MessageSquare className="h-6 w-6 text-orange-600" />
                                    <span className="text-sm">Send Message</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <BarChart3 className="h-6 w-6 text-red-600" />
                                    <span className="text-sm">View Reports</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Calendar className="h-6 w-6 text-indigo-600" />
                                    <span className="text-sm">Schedule</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Schedule */}
                <div className="mt-8">
                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                                Today's Schedule
                            </CardTitle>
                            <CardDescription>
                                Your classes and meetings for today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <div>
                                        <h4 className="font-medium text-blue-900">Mathematics - 10th A</h4>
                                        <p className="text-sm text-blue-700">Algebra: Quadratic Equations</p>
                                    </div>
                                    <div className="text-right text-blue-600">
                                        <p className="font-semibold">9:00 - 9:45 AM</p>
                                        <p className="text-sm">Room 201</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                    <div>
                                        <h4 className="font-medium text-green-900">Mathematics - 10th B</h4>
                                        <p className="text-sm text-green-700">Algebra: Problem Solving</p>
                                    </div>
                                    <div className="text-right text-green-600">
                                        <p className="font-semibold">10:00 - 10:45 AM</p>
                                        <p className="text-sm">Room 201</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                    <div>
                                        <h4 className="font-medium text-purple-900">Advanced Math - 11th A</h4>
                                        <p className="text-sm text-purple-700">Calculus: Integration Techniques</p>
                                    </div>
                                    <div className="text-right text-purple-600">
                                        <p className="font-semibold">2:00 - 2:45 PM</p>
                                        <p className="text-sm">Room 203</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}