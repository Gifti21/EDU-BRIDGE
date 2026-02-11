"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BookOpen,
    Calendar,
    Clock,
    GraduationCap,
    TrendingUp,
    Users,
    FileText,
    Award,
    Bell,
    Settings,
    LogOut,
    Download,
    Eye,
    CheckCircle,
    AlertCircle,
    Star
} from "lucide-react";

interface StudentData {
    name: string;
    studentId: string;
    grade: string;
    section: string;
    avatar?: string;
}

interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: "pending" | "submitted" | "graded";
    score?: number;
}

interface Grade {
    subject: string;
    score: number;
    maxScore: number;
    grade: string;
    color: string;
}

export default function StudentDashboard() {
    const [studentData, setStudentData] = useState<StudentData>({
        name: "John Smith",
        studentId: "STU2025001",
        grade: "10th Grade",
        section: "A"
    });

    const [assignments, setAssignments] = useState<Assignment[]>([
        {
            id: "1",
            title: "Mathematics Quiz - Algebra",
            subject: "Mathematics",
            dueDate: "2025-01-15",
            status: "pending"
        },
        {
            id: "2",
            title: "English Essay - Literature Review",
            subject: "English",
            dueDate: "2025-01-18",
            status: "submitted"
        },
        {
            id: "3",
            title: "Science Lab Report",
            subject: "Physics",
            dueDate: "2025-01-12",
            status: "graded",
            score: 85
        }
    ]);

    const [grades, setGrades] = useState<Grade[]>([
        { subject: "Mathematics", score: 88, maxScore: 100, grade: "A-", color: "text-green-600" },
        { subject: "English", score: 92, maxScore: 100, grade: "A", color: "text-blue-600" },
        { subject: "Physics", score: 85, maxScore: 100, grade: "B+", color: "text-purple-600" },
        { subject: "Chemistry", score: 78, maxScore: 100, grade: "B", color: "text-orange-600" },
        { subject: "History", score: 90, maxScore: 100, grade: "A-", color: "text-indigo-600" }
    ]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case "submitted":
                return <CheckCircle className="h-4 w-4 text-blue-600" />;
            case "graded":
                return <Star className="h-4 w-4 text-green-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-50 text-yellow-800 border-yellow-200";
            case "submitted":
                return "bg-blue-50 text-blue-800 border-blue-200";
            case "graded":
                return "bg-green-50 text-green-800 border-green-200";
            default:
                return "bg-gray-50 text-gray-800 border-gray-200";
        }
    };

    const calculateGPA = () => {
        const total = grades.reduce((sum, grade) => sum + grade.score, 0);
        return (total / grades.length / 100 * 4).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                                <p className="text-gray-600">Welcome back, {studentData.name}</p>
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
                    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                        <GraduationCap className="h-10 w-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">Welcome back, {studentData.name}!</h2>
                                        <p className="text-blue-100 text-lg">
                                            {studentData.grade} • Section {studentData.section} • ID: {studentData.studentId}
                                        </p>
                                        <p className="text-blue-200 mt-2">
                                            Ready to continue your learning journey? Check out your latest assignments and grades below.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 rounded-lg p-4">
                                        <p className="text-blue-100 text-sm">Current GPA</p>
                                        <p className="text-3xl font-bold">{calculateGPA()}</p>
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
                                    <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {assignments.filter(a => a.status === "pending").length}
                                    </p>
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
                                    <p className="text-sm font-medium text-gray-600">Submitted</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {assignments.filter(a => a.status === "submitted").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length)}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                                    <p className="text-3xl font-bold text-purple-600">95%</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Assignments */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                    Recent Assignments
                                </CardTitle>
                                <CardDescription>
                                    Keep track of your assignments and deadlines
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-4">
                                                {getStatusIcon(assignment.status)}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                                                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                                                    <p className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                                </span>
                                                {assignment.score && (
                                                    <span className="text-sm font-semibold text-green-600">
                                                        {assignment.score}%
                                                    </span>
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <Button variant="outline" className="w-full">
                                        View All Assignments
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grades Overview */}
                    <div>
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Award className="h-5 w-5 mr-2 text-green-600" />
                                    Current Grades
                                </CardTitle>
                                <CardDescription>
                                    Your academic performance overview
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {grades.map((grade, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                                                <p className="text-sm text-gray-600">{grade.score}/{grade.maxScore}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-lg font-bold ${grade.color}`}>
                                                    {grade.grade}
                                                </span>
                                                <p className="text-xs text-gray-500">{grade.score}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-blue-900">Overall GPA</span>
                                        <span className="text-2xl font-bold text-blue-600">{calculateGPA()}</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <Button variant="outline" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Report Card
                                    </Button>
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
                                Frequently used features and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                    <span className="text-sm">View Schedule</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <BookOpen className="h-6 w-6 text-green-600" />
                                    <span className="text-sm">Course Materials</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Users className="h-6 w-6 text-purple-600" />
                                    <span className="text-sm">Attendance</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <FileText className="h-6 w-6 text-orange-600" />
                                    <span className="text-sm">Submit Assignment</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}