import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Unlink parent-student validation schema
const unlinkParentStudentSchema = z.object({
    relationshipId: z.string().min(1, "Relationship ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = unlinkParentStudentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { relationshipId } = validationResult.data;

        // Check if relationship exists
        const relationship = await prisma.parentStudent.findUnique({
            where: { id: relationshipId },
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

        if (!relationship) {
            return NextResponse.json(
                { error: "Parent-student relationship not found" },
                { status: 404 }
            );
        }

        // Delete the relationship
        await prisma.parentStudent.delete({
            where: { id: relationshipId }
        });

        console.log(`[Admin] Parent-student relationship removed: ${relationship.parent.user.email} -> ${relationship.student.user.email}`);

        return NextResponse.json({
            success: true,
            message: "Parent-student relationship removed successfully",
            data: {
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
        }, { status: 200 });

    } catch (error) {
        console.error("Unlink parent-student error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
