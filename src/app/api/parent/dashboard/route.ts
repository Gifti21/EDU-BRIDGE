import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        const user = await requireRole(['PARENT']);

        // Get parent profile with children
        const parentProfile = await prisma.parentProfile.findUnique({
            where: { userId: user.userId },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                },
                children: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    include: {
                                        profile: true
                                    }
                                },
                                grades: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 5
                                },
                                attendance: {
                                    orderBy: { date: 'desc' },
                                    take: 10
                                },
                                assignments: {
                                    include: {
                                        assignment: true
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 5
                                },
                                enrollments: {
                                    where: { status: 'ACTIVE' },
                                    include: {
                                        course: true
                                    }
                                }
                            }
                        }
                    }
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!parentProfile) {
            return NextResponse.json(
                { error: "Parent profile not found" },
                { status: 404 }
            );
        }

        // Format children data
        const children = parentProfile.children.map(link => {
            const student = link.student;
            const profile = student.user.profile;

            // Calculate statistics for each child
            const totalAttendance = student.attendance.length;
            const presentCount = student.attendance.filter(a => a.status === 'PRESENT').length;
            const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

            const gradesWithGPA = student.grades.filter(g => g.gpa !== null);
            const averageGPA = gradesWithGPA.length > 0
                ? gradesWithGPA.reduce((sum, g) => sum + (g.gpa || 0), 0) / gradesWithGPA.length
                : 0;

            const pendingAssignments = student.assignments.filter(a => a.status === 'PENDING').length;

            return {
                id: student.id,
                studentId: student.studentId,
                name: `${profile?.firstName} ${profile?.lastName}`,
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                gradeLevel: student.gradeLevel,
                section: student.section,
                avatar: profile?.avatar,
                isPrimary: link.isPrimary,
                statistics: {
                    attendanceRate: parseFloat(attendanceRate.toFixed(1)),
                    averageGPA: parseFloat(averageGPA.toFixed(2)),
                    pendingAssignments,
                    totalCourses: student.enrollments.length
                },
                recentGrades: student.grades.map(grade => ({
                    id: grade.id,
                    courseId: grade.courseId,
                    finalGrade: grade.finalGrade,
                    gpa: grade.gpa,
                    academicYear: grade.academicYear,
                    semester: grade.semester
                })),
                recentAttendance: student.attendance.map(att => ({
                    id: att.id,
                    date: att.date,
                    status: att.status,
                    checkInTime: att.checkInTime
                })),
                recentAssignments: student.assignments.map(sub => ({
                    id: sub.id,
                    title: sub.assignment.title,
                    type: sub.assignment.type,
                    dueDate: sub.assignment.dueDate,
                    status: sub.status,
                    pointsEarned: sub.pointsEarned,
                    maxPoints: sub.assignment.maxPoints
                })),
                enrolledCourses: student.enrollments.map(enrollment => ({
                    id: enrollment.id,
                    courseName: enrollment.course.courseName,
                    courseCode: enrollment.course.courseCode,
                    department: enrollment.course.department
                }))
            };
        });

        // Calculate payment statistics
        const totalPayments = parentProfile.payments.length;
        const completedPayments = parentProfile.payments.filter(p => p.status === 'COMPLETED').length;
        const pendingPayments = parentProfile.payments.filter(p => p.status === 'PENDING').length;
        const totalPaid = parentProfile.payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, p) => sum + p.amount, 0);

        return NextResponse.json({
            success: true,
            data: {
                parent: {
                    id: parentProfile.id,
                    name: `${parentProfile.user.profile?.firstName} ${parentProfile.user.profile?.lastName}`,
                    email: parentProfile.user.email,
                    phone: parentProfile.user.profile?.phone,
                    relationship: parentProfile.relationship,
                    occupation: parentProfile.occupation
                },
                children,
                payments: {
                    recent: parentProfile.payments.map(payment => ({
                        id: payment.id,
                        studentId: payment.studentId,
                        amount: payment.amount,
                        feeType: payment.feeType,
                        paymentMethod: payment.paymentMethod,
                        status: payment.status,
                        transactionId: payment.transactionId,
                        receiptNumber: payment.receiptNumber,
                        paidAt: payment.paidAt,
                        createdAt: payment.createdAt
                    })),
                    statistics: {
                        total: totalPayments,
                        completed: completedPayments,
                        pending: pendingPayments,
                        totalPaid
                    }
                }
            }
        });

    } catch (error) {
        console.error("Parent dashboard error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
