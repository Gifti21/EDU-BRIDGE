import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Course delete validation schema
const deleteCourseSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
});

export async function DELETE(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = deleteCourseSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { courseId } = validationResult.data;

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        assignments: true
                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Check if course has enrollments or assignments
        if (course._count.enrollments > 0 || course._count.assignments > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete course with existing enrollments or assignments. Consider deactivating instead.",
                    details: {
                        enrollments: course._count.enrollments,
                        assignments: course._count.assignments
                    }
                },
                { status: 400 }
            );
        }

        // Delete prerequisite relationships
        await prisma.coursePrerequisite.deleteMany({
            where: {
                OR: [
                    { courseId },
                    { prerequisiteId: courseId }
                ]
            }
        });

        // Delete the course
        await prisma.course.delete({
            where: { id: courseId }
        });

        console.log(`[Admin] Course deleted: ${course.courseCode} - ${course.courseName}`);

        return NextResponse.json({
            success: true,
            message: "Course deleted successfully",
            data: {
                courseCode: course.courseCode,
                courseName: course.courseName
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Course delete error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
