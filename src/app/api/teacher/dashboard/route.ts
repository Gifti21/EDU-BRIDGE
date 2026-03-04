import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        const user = await requireRole(['TEACHER']);

        // Get teacher profile with courses
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: user.userId },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                },
                courses: {
                    include: {
                        course: {
                            include: {
                                enrollments: {
                                    where: { status: 'ACTIVE' },
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
                                    }
                                },
                                schedules: {
                                    include: {
                                        room: true,
                                        timeSlot: true
                                    }
                                }
                            }
                        }
                    }
                },
                attendance: {
                    orderBy: { date: 'desc' },
                    take: 30
                }
            }
        });

        if (!teacherProfile) {
            return NextResponse.json(
                { error: "Teacher profile not found" },
                { status: 404 }
            );
        }

        // Get assignments for teacher's courses
        const courseIds = teacherProfile.courses.map(c => c.courseId);
        const assignments = await prisma.assignment.findMany({
            where: {
                courseId: { in: courseIds }
            },
            include: {
                submissions: {
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
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Calculate statistics
        const totalStudents = teacherProfile.courses.reduce(
            (sum, course) => sum + course.course.enrollments.length,
            0
        );

        const totalAssignments = assignments.length;
        const pendingGrading = assignments.reduce(
            (sum, assignment) => sum + assignment.submissions.filter(s => s.status === 'SUBMITTED').length,
            0
        );

        // Calculate attendance rate
        const totalAttendance = teacherProfile.attendance.length;
        const presentCount = teacherProfile.attendance.filter(a => a.status === 'PRESENT').length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

        // Format classes data
        const classes = teacherProfile.courses.map(courseAssignment => {
            const course = courseAssignment.course;
            const students = course.enrollments;

            return {
                id: course.id,
                courseCode: course.courseCode,
                courseName: course.courseName,
                description: course.description,
                credits: course.credits,
                gradeLevel: course.gradeLevel,
                department: course.department,
                academicYear: courseAssignment.academicYear,
                semester: courseAssignment.semester,
                isPrimary: courseAssignment.isPrimary,
                studentCount: students.length,
                students: students.map(enrollment => ({
                    id: enrollment.student.id,
                    studentId: enrollment.student.studentId,
                    name: `${enrollment.student.user.profile?.firstName} ${enrollment.student.user.profile?.lastName}`,
                    email: enrollment.student.user.email,
                    gradeLevel: enrollment.student.gradeLevel,
                    section: enrollment.student.section
                })),
                schedules: course.schedules.map(schedule => ({
                    id: schedule.id,
                    dayOfWeek: schedule.timeSlot.dayOfWeek,
                    startTime: schedule.timeSlot.startTime,
                    endTime: schedule.timeSlot.endTime,
                    roomNumber: schedule.room.roomNumber,
                    building: schedule.room.building
                }))
            };
        });

        // Format assignments data
        const formattedAssignments = assignments.map(assignment => {
            const totalSubmissions = assignment.submissions.length;
            const gradedSubmissions = assignment.submissions.filter(s => s.status === 'GRADED').length;
            const pendingSubmissions = assignment.submissions.filter(s => s.status === 'SUBMITTED').length;

            return {
                id: assignment.id,
                courseId: assignment.courseId,
                title: assignment.title,
                description: assignment.description,
                type: assignment.type,
                dueDate: assignment.dueDate,
                maxPoints: assignment.maxPoints,
                weight: assignment.weight,
                submissions: {
                    total: totalSubmissions,
                    graded: gradedSubmissions,
                    pending: pendingSubmissions
                },
                createdAt: assignment.createdAt
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                teacher: {
                    id: teacherProfile.id,
                    employeeId: teacherProfile.employeeId,
                    name: `${teacherProfile.user.profile?.firstName} ${teacherProfile.user.profile?.lastName}`,
                    firstName: teacherProfile.user.profile?.firstName,
                    lastName: teacherProfile.user.profile?.lastName,
                    email: teacherProfile.user.email,
                    phone: teacherProfile.user.profile?.phone,
                    department: teacherProfile.department,
                    specialization: teacherProfile.specialization,
                    hireDate: teacherProfile.hireDate
                },
                statistics: {
                    totalClasses: teacherProfile.courses.length,
                    totalStudents,
                    totalAssignments,
                    pendingGrading,
                    attendanceRate: parseFloat(attendanceRate.toFixed(1))
                },
                classes,
                recentAssignments: formattedAssignments,
                recentAttendance: teacherProfile.attendance.map(att => ({
                    id: att.id,
                    date: att.date,
                    status: att.status,
                    checkInTime: att.checkInTime,
                    checkOutTime: att.checkOutTime,
                    remarks: att.remarks
                }))
            }
        });

    } catch (error) {
        console.error("Teacher dashboard error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
