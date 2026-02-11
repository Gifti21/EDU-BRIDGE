import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Link parent-student validation schema
const linkParentStudentSchema = z.object({
    parentId: z.string().min(1, "Parent ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
    isPrimary: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = linkParentStudentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { parentId, studentId, isPrimary } = validationResult.data;

        // Verify parent exists and has PARENT role
        const parent = await prisma.parentProfile.findUnique({
            where: { id: parentId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!parent) {
            return NextResponse.json(
                { error: "Parent profile not found" },
                { status: 404 }
            );
        }

        if (parent.user.role !== 'PARENT') {
            return NextResponse.json(
                { error: "User is not a parent" },
                { status: 400 }
            );
        }

        // Verify student exists and has STUDENT role
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student profile not found" },
                { status: 404 }
            );
        }

        if (student.user.role !== 'STUDENT') {
            return NextResponse.json(
                { error: "User is not a student" },
                { status: 400 }
            );
        }

        // Check if relationship already exists
        const existingRelationship = await prisma.parentStudent.findUnique({
            where: {
                parentId_studentId: {
                    parentId,
                    studentId
                }
            }
        });

        if (existingRelationship) {
            return NextResponse.json(
                { error: "Parent-student relationship already exists" },
                { status: 409 }
            );
        }

        // If setting as primary, unset other primary relationships for this student
        if (isPrimary) {
            await prisma.parentStudent.updateMany({
                where: {
                    studentId,
                    isPrimary: true
                },
                data: {
                    isPrimary: false
                }
            });
        }

        // Create the relationship
        const relationship = await prisma.parentStudent.create({
            data: {
                parentId,
                studentId,
                isPrimary
            },
            include: {
                parent: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                },
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
        });

        console.log(`[Admin] Parent-student relationship created: ${parent.user.email} -> ${student.user.email}`);

        return NextResponse.json({
            success: true,
            message: "Parent-student relationship created successfully",
            data: {
                id: relationship.id,
                parentId: relationship.parentId,
                studentId: relationship.studentId,
                isPrimary: relationship.isPrimary,
                parent: {
                    email: relationship.parent.user.email,
                    name: `${relationship.parent.user.profile?.firstName} ${relationship.parent.user.profile?.lastName}`
                },
                student: {
                    email: relationship.student.user.email,
                    name: `${relationship.student.user.profile?.firstName} ${relationship.student.user.profile?.lastName}`,
                    studentId: relationship.student.studentId
                }
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Link parent-student error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
