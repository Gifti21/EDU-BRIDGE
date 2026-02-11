import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Course update validation schema
const updateCourseSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
    courseName: z.string().min(2, "Course name must be at least 2 characters").optional(),
    description: z.string().optional(),
    credits: z.number().min(0, "Credits must be a positive number").optional(),
    gradeLevel: z.string().min(1, "Grade level is required").optional(),
    department: z.string().min(1, "Department is required").optional(),
    isActive: z.boolean().optional(),
    prerequisites: z.array(z.string()).optional(), // Array of course IDs
});

export async function PUT(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = updateCourseSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { courseId, prerequisites, ...updateData } = validationResult.data;

        // Check if course exists
        const existingCourse = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!existingCourse) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Validate prerequisites exist and don't create circular dependencies
        if (prerequisites !== undefined) {
            if (prerequisites.length > 0) {
                // Check if prerequisites exist
                const prerequisiteCourses = await prisma.course.findMany({
                    where: {
                        id: {
                            in: prerequisites
                        }
                    }
                });

                if (prerequisiteCourses.length !== prerequisites.length) {
                    return NextResponse.json(
                        { error: "One or more prerequisite courses not found" },
                        { status: 400 }
                    );
                }

                // Check for circular dependency (course can't be its own prerequisite)
                if (prerequisites.includes(courseId)) {
                    return NextResponse.json(
                        { error: "Course cannot be its own prerequisite" },
                        { status: 400 }
                    );
                }
            }

            // Update prerequisites
            // Delete existing prerequisites
            await prisma.coursePrerequisite.deleteMany({
                where: { courseId }
            });

            // Create new prerequisites
            if (prerequisites.length > 0) {
                await prisma.coursePrerequisite.createMany({
                    data: prerequisites.map(prereqId => ({
                        courseId,
                        prerequisiteId: prereqId
                    }))
                });
            }
        }

        // Update the course
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: updateData,
            include: {
                prerequisites: {
                    include: {
                        prerequisite: {
                            select: {
                                id: true,
                                courseCode: true,
                                courseName: true
                            }
                        }
                    }
                }
            }
        });

        console.log(`[Admin] Course updated: ${updatedCourse.courseCode} - ${updatedCourse.courseName}`);

        return NextResponse.json({
            success: true,
            message: "Course updated successfully",
            data: {
                id: updatedCourse.id,
                courseCode: updatedCourse.courseCode,
                courseName: updatedCourse.courseName,
                description: updatedCourse.description,
                credits: updatedCourse.credits,
                gradeLevel: updatedCourse.gradeLevel,
                department: updatedCourse.department,
                isActive: updatedCourse.isActive,
                prerequisites: updatedCourse.prerequisites.map(p => ({
                    id: p.prerequisite.id,
                    courseCode: p.prerequisite.courseCode,
                    courseName: p.prerequisite.courseName
                }))
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Course update error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
