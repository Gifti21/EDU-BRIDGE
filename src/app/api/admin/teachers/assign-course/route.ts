import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Teacher-course assignment validation schema
const assignTeacherSchema = z.object({
    teacherId: z.string().min(1, "Teacher ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    academicYear: z.string().min(1, "Academic year is required"),
    semester: z.string().min(1, "Semester is required"),
    isPrimary: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = assignTeacherSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { teacherId, courseId, academicYear, semester, isPrimary } = validationResult.data;

        // Verify teacher exists
        const teacher = await prisma.teacherProfile.findUnique({
            where: { id: teacherId },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!teacher) {
            return NextResponse.json(
                { error: "Teacher not found" },
                { status: 404 }
            );
        }

        // Verify course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Check if assignment already exists
        const existingAssignment = await prisma.courseAssignment.findUnique({
            where: {
                courseId_teacherId_academicYear_semester: {
                    courseId,
                    teacherId,
                    academicYear,
                    semester
                }
            }
        });

        if (existingAssignment) {
            return NextResponse.json(
                { error: "Teacher is already assigned to this course for the specified period" },
                { status: 409 }
            );
        }

        // Create the assignment
        const assignment = await prisma.courseAssignment.create({
            data: {
                teacherId,
                courseId,
                academicYear,
                semester,
                isPrimary
            },
            include: {
                teacher: {
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

        console.log(`[Admin] Teacher assigned to course: ${teacher.employeeId} -> ${course.courseCode}`);

        return NextResponse.json({
            success: true,
            message: "Teacher assigned to course successfully",
            data: {
                id: assignment.id,
                teacher: {
                    id: assignment.teacherId,
                    employeeId: assignment.teacher.employeeId,
                    name: `${assignment.teacher.user.profile?.firstName} ${assignment.teacher.user.profile?.lastName}`,
                    email: assignment.teacher.user.email
                },
                course: {
                    id: assignment.courseId,
                    courseCode: assignment.course.courseCode,
                    courseName: assignment.course.courseName
                },
                academicYear: assignment.academicYear,
                semester: assignment.semester,
                isPrimary: assignment.isPrimary
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Teacher assignment error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
