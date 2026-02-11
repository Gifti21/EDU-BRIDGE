"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    TrendingUp,
    Calendar,
    MessageSquare,
    Bell,
    Settings,
    LogOut,
    Eye,
    Download,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    AlertTriangle,
    BookOpen,
    Award,
    User
} from "lucide-react";

interface Child {
    id: string;
    name: string;
    grade: string;
    section: string;
    studentId: string;
    avatar?: string;
}

interface Grade {
    subject: string;
    score: number;
    maxScore: number;
    grade: string;
    trend: "up" | "down" | "stable";
}

interface Attendance {
    date: string;
    status: "present" | "absent" | "late";
}

interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: "pending" | "submitted" | "graded";
    score?: number;
}

export default function ParentDashboard() {
    const [selectedChild, setSelectedChild] = useState(0);
    const [children, setChildren] = useState<Child[]>([
        {
            id: "1",
            name: "Emma Wilson",
            grade: "10th Grade",
            section: "A",
            studentId: "STU2025001"
        },
        {
            id: "2",
            name: "James Wilson",
            grade: "8th Grade",
            section: "B",
            studentId: "STU2025002"
        }
    ]);

    const [grades, setGrades] = useState<Grade[]>([
        { subject: "Mathematics", score: 88, maxScore: 100, grade: "A-", trend: "up" },
        { subject: "English", score: 92, maxScore: 100, grade: "A", trend: "stable" },
        { subject: "Science", score: 85, maxScore: 100, grade: "B+", trend: "up" },
        { subject: "History", score: 78, maxScore: 100, grade: "B", trend: "down" },
        { subject: "Art", score: 95, maxScore: 100, grade: "A+", trend: "up" }
    ]);

    const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([
        { date: "2025-01-10", status: "present" },
        { date: "2025-01-09", status: "present" },
        { date: "2025-01-08", status: "late" },
        { date: "2025-01-07", status: "present" },
        { date: "2025-01-06", status: "absent" }
    ]);

    const [assignments, setAssignments] = useState<Assignment[]>([
        { id: "1", title: "Math Quiz - Algebra", subject: "Mathematics", dueDate: "2025-01-15", status: "pending" },
        { id: "2", title: "English Essay", subject: "English", dueDate: "2025-01-18", status: "submitted" },
        { id: "3", title: "Science Project", subject: "Science", dueDate: "2025-01-12", status: "graded", score: 85 }
    ]);

    const currentChild = children[selectedChild];
    const attendanceRate = (recentAttendance.filter(a => a.status === "present").length / recentAttendance.length) * 100;
    const averageGrade = grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;

    const getAttendanceIcon = (status: string) => {
        switch (status) {
            case "present":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "late":
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case "absent":
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up":
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "down":
                return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
            default:
                return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
                                <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
                                <p className="text-gray-600">Monitor your child's progress</p>
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
                {/* Child Selection */}
                {children.length > 1 && (
                    <div className="mb-8">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle>Select Child</CardTitle>
                                <CardDescription>Choose which child's information to view</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4">
                                    {children.map((child, index) => (
                                        <Button
                                            key={child.id}
                                            variant={selectedChild === index ? "default" : "outline"}
                                            onClick={() => setSelectedChild(index)}
                                            className="flex items-center space-x-2"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>{child.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Welcome Section */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                        <Users className="h-10 w-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">{currentChild.name}</h2>
                                        <p className="text-purple-100 text-lg">
                                            {currentChild.grade} • Section {currentChild.section} • ID: {currentChild.studentId}
                                        </p>
                                        <p className="text-purple-200 mt-2">
                                            Stay connected with your child's educational journey and academic progress.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 rounded-lg p-4">
                                        <p className="text-purple-100 text-sm">Attendance Rate</p>
                                        <p className="text-3xl font-bold">{Math.round(attendanceRate)}%</p>
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
                                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                                    <p className="text-3xl font-bold text-blue-600">{Math.round(averageGrade)}%</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                                    <p className="text-3xl font-bold text-green-600">{Math.round(attendanceRate)}%</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {assignments.filter(a => a.status === "pending").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Messages</p>
                                    <p className="text-3xl font-bold text-purple-600">3</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Academic Performance */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                                    Academic Performance
                                </CardTitle>
                                <CardDescription>
                                    Current grades and performance trends
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {grades.map((grade, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{grade.subject}</h3>
                                                    <p className="text-sm text-gray-600">{grade.score}/{grade.maxScore} points</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {getTrendIcon(grade.trend)}
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-blue-600">{grade.grade}</span>
                                                    <p className="text-sm text-gray-500">{grade.score}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-blue-900">Overall Average</span>
                                        <span className="text-2xl font-bold text-blue-600">{Math.round(averageGrade)}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-6">
                        {/* Attendance */}
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                                    Recent Attendance
                                </CardTitle>
                                <CardDescription>
                                    Last 5 school days
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentAttendance.map((attendance, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                {new Date(attendance.date).toLocaleDateString()}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                {getAttendanceIcon(attendance.status)}
                                                <span className={`text-sm font-medium capitalize ${attendance.status === "present" ? "text-green-600" :
                                                        attendance.status === "late" ? "text-yellow-600" : "text-red-600"
                                                    }`}>
                                                    {attendance.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Assignments */}
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                                    Upcoming Tasks
                                </CardTitle>
                                <CardDescription>
                                    Assignments and deadlines
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="p-3 border border-gray-200 rounded-lg">
                                            <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                                            <p className="text-xs text-gray-600">{assignment.subject}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500">
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${assignment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                        assignment.status === "submitted" ? "bg-blue-100 text-blue-800" :
                                                            "bg-green-100 text-green-800"
                                                    }`}>
                                                    {assignment.status}
                                                </span>
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
                                Frequently used parent features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <MessageSquare className="h-6 w-6 text-blue-600" />
                                    <span className="text-sm">Message Teacher</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Download className="h-6 w-6 text-green-600" />
                                    <span className="text-sm">Download Reports</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                    <span className="text-sm">View Schedule</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Phone className="h-6 w-6 text-orange-600" />
                                    <span className="text-sm">Contact School</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Teacher Contact */}
                <div className="mt-8">
                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="h-5 w-5 mr-2 text-purple-600" />
                                Class Teachers
                            </CardTitle>
                            <CardDescription>
                                Contact information for your child's teachers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Ms. Sarah Johnson</h4>
                                            <p className="text-sm text-gray-600">Mathematics Teacher</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Mr. David Chen</h4>
                                            <p className="text-sm text-gray-600">Class Teacher</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
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