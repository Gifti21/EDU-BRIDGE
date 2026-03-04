import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        const user = await requireRole(['STUDENT']);

        // Get student profile
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId: user.userId },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                },
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        course: true
                    }
                },
                grades: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    include: {
                                        profile: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                attendance: {
                    orderBy: { date: 'desc' },
                    take: 30
                },
                assignments: {
                    include: {
                        assignment: true
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!studentProfile) {
            return NextResponse.json(
                { error: "Student profile not found" },
                { status: 404 }
            );
        }

        // Calculate statistics
        const totalAssignments = studentProfile.assignments.length;
        const submittedAssignments = studentProfile.assignments.filter(a => a.status === 'SUBMITTED' || a.status === 'GRADED').length;
        const pendingAssignments = studentProfile.assignments.filter(a => a.status === 'PENDING').length;
        const gradedAssignments = studentProfile.assignments.filter(a => a.status === 'GRADED').length;

        // Calculate average grade
        const gradesWithScores = studentProfile.grades.filter(g => g.gpa !== null);
        const averageGPA = gradesWithScores.length > 0
            ? gradesWithScores.reduce((sum, g) => sum + (g.gpa || 0), 0) / gradesWithScores.length
            : 0;

        // Calculate attendance rate
        const totalAttendance = studentProfile.attendance.length;
        const presentCount = studentProfile.attendance.filter(a => a.status === 'PRESENT').length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

        return NextResponse.json({
            success: true,
            data: {
                student: {
                    id: studentProfile.id,
                    studentId: studentProfile.studentId,
                    name: `${studentProfile.user.profile?.firstName} ${studentProfile.user.profile?.lastName}`,
                    firstName: studentProfile.user.profile?.firstName,
                    lastName: studentProfile.user.profile?.lastName,
                    email: studentProfile.user.email,
                    gradeLevel: studentProfile.gradeLevel,
                    section: studentProfile.section,
                    avatar: studentProfile.user.profile?.avatar,
                    enrollmentDate: studentProfile.enrollmentDate
                },
                statistics: {
                    totalAssignments,
                    submittedAssignments,
                    pendingAssignments,
                    gradedAssignments,
                    averageGPA: parseFloat(averageGPA.toFixed(2)),
                    attendanceRate: parseFloat(attendanceRate.toFixed(1)),
                    totalCourses: studentProfile.enrollments.length
                },
                recentGrades: studentProfile.grades.map(grade => ({
                    id: grade.id,
                    courseId: grade.courseId,
                    academicYear: grade.academicYear,
                    semester: grade.semester,
                    finalGrade: grade.finalGrade,
                    gpa: grade.gpa,
                    assignmentGrade: grade.assignmentGrade,
                    quizGrade: grade.quizGrade,
                    midtermGrade: grade.midtermGrade,
                    finalExamGrade: grade.finalExamGrade,
                    remarks: grade.remarks,
                    createdAt: grade.createdAt
                })),
                recentAttendance: studentProfile.attendance.map(att => ({
                    id: att.id,
                    date: att.date,
                    status: att.status,
                    checkInTime: att.checkInTime,
                    remarks: att.remarks,
                    courseId: att.courseId
                })),
                recentAssignments: studentProfile.assignments.map(sub => ({
                    id: sub.id,
                    assignmentId: sub.assignmentId,
                    title: sub.assignment.title,
                    description: sub.assignment.description,
                    type: sub.assignment.type,
                    dueDate: sub.assignment.dueDate,
                    maxPoints: sub.assignment.maxPoints,
                    status: sub.status,
                    submittedAt: sub.submittedAt,
                    pointsEarned: sub.pointsEarned,
                    feedback: sub.feedback,
                    gradedAt: sub.gradedAt
                })),
                enrolledCourses: studentProfile.enrollments.map(enrollment => ({
                    id: enrollment.id,
                    courseId: enrollment.courseId,
                    courseName: enrollment.course.courseName,
                    courseCode: enrollment.course.courseCode,
                    credits: enrollment.course.credits,
                    department: enrollment.course.department,
                    status: enrollment.status,
                    enrollmentDate: enrollment.enrollmentDate
                }))
            }
        });

    } catch (error) {
        console.error("Student dashboard error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
