import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Approval validation schema
const approvalSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    registrationId: z.string().min(1, "Registration ID is required"),
    action: z.enum(["approve", "reject"]),
    reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request data
        const validationResult = approvalSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { userId, registrationId, action, reason } = validationResult.data;

        // In a real app, you'd verify admin authentication here
        // const adminUserId = getAdminUserIdFromToken(request);

        // Start a transaction to update both user and registration
        const result = await prisma.$transaction(async (tx) => {
            // Update the user approval status
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    isApproved: action === "approve",
                },
                include: {
                    profile: true
                }
            });

            // Update the registration status
            const updatedRegistration = await tx.userRegistration.update({
                where: { id: registrationId },
                data: {
                    status: action === "approve" ? "APPROVED" : "REJECTED",
                    reviewedAt: new Date(),
                    reviewedBy: "admin", // In real app, use actual admin ID
                    rejectionReason: action === "reject" ? reason : null,
                }
            });

            return { user: updatedUser, registration: updatedRegistration };
        });

        // TODO: Send email notification to user about approval/rejection
        // This would be implemented with a service like SendGrid, Resend, or Nodemailer

        // Log the action for audit purposes
        await prisma.auditLog.create({
            data: {
                userId: "admin", // In real app, use actual admin ID
                action: action === "approve" ? "USER_APPROVED" : "USER_REJECTED",
                resource: "USER",
                resourceId: userId,
                oldValues: JSON.stringify({ isApproved: false }),
                newValues: JSON.stringify({
                    isApproved: action === "approve",
                    reason: reason || null
                }),
            }
        });

        return NextResponse.json({
            success: true,
            message: `User ${action === "approve" ? "approved" : "rejected"} successfully`,
            data: {
                userId: result.user.id,
                email: result.user.email,
                status: result.registration.status,
                reviewedAt: result.registration.reviewedAt
            }
        });

    } catch (error) {
        console.error("Error processing user approval:", error);

        // Handle specific Prisma errors
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json(
                { error: "User or registration not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}