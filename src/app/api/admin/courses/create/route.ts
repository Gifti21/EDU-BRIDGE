import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Course creation validation schema
const createCourseSchema = z.object({
    courseName: z.string().min(2, "Course name must be at least 2 characters"),
    courseCode: z.string().optional(), // Will be auto-generated if not provided
    description: z.string().optional(),
    credits: z.number().min(0, "Credits must be a positive number"),
    gradeLevel: z.string().min(1, "Grade level is required"),
    department: z.string().min(1, "Department is required"),
    prerequisites: z.array(z.string()).optional().default([]), // Array of course IDs
});

/**
 * Generate unique course code
 * Format: DEPT-GRADE-NNN (e.g., MATH-10-001)
 */
async function generateCourseCode(department: string, gradeLevel: string): Promise<string> {
    // Extract department abbreviation (first 4 letters, uppercase)
    const deptCode = department.substring(0, 4).toUpperCase();

    // Extract grade number
    const gradeMatch = gradeLevel.match(/\d+/);
    const gradeNum = gradeMatch ? gradeMatch[0] : '00';

    const prefix = `${deptCode}-${gradeNum}-`;

    // Find the latest course code with this prefix
    const latestCourse = await prisma.course.findFirst({
        where: {
            courseCode: {
                startsWith: prefix
            }
        },
        orderBy: {
            courseCode: 'desc'
        },
        select: {
            courseCode: true
        }
    });

    let nextNumber = 1;
    if (latestCourse) {
        const lastNumber = parseInt(latestCourse.courseCode.split('-')[2]);
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
}

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = createCourseSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Generate course code if not provided
        const courseCode = data.courseCode || await generateCourseCode(data.department, data.gradeLevel);

        // Check if course code already exists
        const existingCourse = await prisma.course.findUnique({
            where: { courseCode }
        });

        if (existingCourse) {
            return NextResponse.json(
                { error: "Course with this code already exists" },
                { status: 409 }
            );
        }

        // Validate prerequisites exist
        if (data.prerequisites && data.prerequisites.length > 0) {
            const prerequisiteCourses = await prisma.course.findMany({
                where: {
                    id: {
                        in: data.prerequisites
                    }
                }
            });

            if (prerequisiteCourses.length !== data.prerequisites.length) {
                return NextResponse.json(
                    { error: "One or more prerequisite courses not found" },
                    { status: 400 }
                );
            }
        }

        // Create the course
        const course = await prisma.course.create({
            data: {
                courseName: data.courseName,
                courseCode,
                description: data.description,
                credits: data.credits,
                gradeLevel: data.gradeLevel,
                department: data.department,
                isActive: true,
            }
        });

        // Create prerequisite relationships
        if (data.prerequisites && data.prerequisites.length > 0) {
            await prisma.coursePrerequisite.createMany({
                data: data.prerequisites.map(prereqId => ({
                    courseId: course.id,
                    prerequisiteId: prereqId
                }))
            });
        }

        // Fetch course with prerequisites
        const courseWithPrereqs = await prisma.course.findUnique({
            where: { id: course.id },
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

        console.log(`[Admin] Course created: ${courseCode} - ${data.courseName}`);

        return NextResponse.json({
            success: true,
            message: "Course created successfully",
            data: {
                id: courseWithPrereqs!.id,
                courseCode: courseWithPrereqs!.courseCode,
                courseName: courseWithPrereqs!.courseName,
                description: courseWithPrereqs!.description,
                credits: courseWithPrereqs!.credits,
                gradeLevel: courseWithPrereqs!.gradeLevel,
                department: courseWithPrereqs!.department,
                isActive: courseWithPrereqs!.isActive,
                prerequisites: courseWithPrereqs!.prerequisites.map(p => ({
                    id: p.prerequisite.id,
                    courseCode: p.prerequisite.courseCode,
                    courseName: p.prerequisite.courseName
                }))
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Course creation error:", error);

        // Handle Prisma unique constraint errors
        if (error instanceof Error && error.message.includes("Unique constraint")) {
            return NextResponse.json(
                { error: "Course with this code already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
