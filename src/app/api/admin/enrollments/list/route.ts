import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        // Verify admin or teacher authentication
        await requireRole(['ADMINISTRATOR', 'TEACHER']);

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const studentId = searchParams.get('studentId');
        const academicYear = searchParams.get('academicYear');
        const semester = searchParams.get('semester');
        const status = searchParams.get('status');

        // Build where clause
        const where: any = {};
        if (courseId) where.courseId = courseId;
        if (studentId) where.studentId = studentId;
        if (academicYear) where.academicYear = academicYear;
        if (semester) where.semester = semester;
        if (status) where.status = status;

        // Get enrollments
        const enrollments = await prisma.courseEnrollment.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                },
                course: true
            },
            orderBy: [
                { academicYear: 'desc' },
                { semester: 'desc' },
                { course: { courseCode: 'asc' } },
                { student: { studentId: 'asc' } }
            ]
        });

        // Format response
        const formattedEnrollments = enrollments.map(enrollment => ({
            id: enrollment.id,
            student: {
                id: enrollment.studentId,
                studentId: enrollment.student.studentId,
                name: `${enrollment.student.user.profile?.firstName} ${enrollment.student.user.profile?.lastName}`,
                email: enrollment.student.user.email,
                gradeLevel: enrollment.student.gradeLevel,
                section: enrollment.student.section
            },
            course: {
                id: enrollment.courseId,
                courseCode: enrollment.course.courseCode,
                courseName: enrollment.course.courseName,
                credits: enrollment.course.credits,
                department: enrollment.course.department
            },
            academicYear: enrollment.academicYear,
            semester: enrollment.semester,
            status: enrollment.status,
            finalGrade: enrollment.finalGrade,
            enrollmentDate: enrollment.enrollmentDate
        }));

        return NextResponse.json({
            success: true,
            data: formattedEnrollments,
            count: formattedEnrollments.length
        }, { status: 200 });

    } catch (error) {
        console.error("List enrollments error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
