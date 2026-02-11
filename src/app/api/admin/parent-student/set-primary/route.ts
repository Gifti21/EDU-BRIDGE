import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Set primary parent validation schema
const setPrimaryParentSchema = z.object({
    relationshipId: z.string().min(1, "Relationship ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = setPrimaryParentSchema.safeParse(body);

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

        // Unset all primary relationships for this student
        await prisma.parentStudent.updateMany({
            where: {
                studentId: relationship.studentId,
                isPrimary: true
            },
            data: {
                isPrimary: false
            }
        });

        // Set this relationship as primary
        const updatedRelationship = await prisma.parentStudent.update({
            where: { id: relationshipId },
            data: { isPrimary: true }
        });

        console.log(`[Admin] Primary parent set: ${relationship.parent.user.email} for student ${relationship.student.studentId}`);

        return NextResponse.json({
            success: true,
            message: "Primary parent designation updated successfully",
            data: {
                id: updatedRelationship.id,
                isPrimary: updatedRelationship.isPrimary,
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
        console.error("Set primary parent error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
