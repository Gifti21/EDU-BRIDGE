import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Drop enrollment validation schema
const dropEnrollmentSchema = z.object({
    enrollmentId: z.string().min(1, "Enrollment ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = dropEnrollmentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { enrollmentId } = validationResult.data;

        // Check if enrollment exists
        const enrollment = await prisma.courseEnrollment.findUnique({
            where: { id: enrollmentId },
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
            }
        });

        if (!enrollment) {
            return NextResponse.json(
                { error: "Enrollment not found" },
                { status: 404 }
            );
        }

        if (enrollment.status === 'DROPPED') {
            return NextResponse.json(
                { error: "Enrollment is already dropped" },
                { status: 400 }
            );
        }

        if (enrollment.status === 'COMPLETED') {
            return NextResponse.json(
                { error: "Cannot drop a completed course" },
                { status: 400 }
            );
        }

        // Update enrollment status to DROPPED
        const updatedEnrollment = await prisma.courseEnrollment.update({
            where: { id: enrollmentId },
            data: {
                status: 'DROPPED'
            }
        });

        console.log(`[Admin] Enrollment dropped: ${enrollment.student.studentId} from ${enrollment.course.courseCode}`);

        return NextResponse.json({
            success: true,
            message: "Enrollment dropped successfully",
            data: {
                id: updatedEnrollment.id,
                student: {
                    studentId: enrollment.student.studentId,
                    name: `${enrollment.student.user.profile?.firstName} ${enrollment.student.user.profile?.lastName}`
                },
                course: {
                    courseCode: enrollment.course.courseCode,
                    courseName: enrollment.course.courseName
                },
                status: updatedEnrollment.status
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Drop enrollment error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
