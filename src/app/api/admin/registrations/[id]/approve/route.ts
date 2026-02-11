import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/registrations/[id]/approve
 * Approve a pending user registration request
 * 
 * @param id - Registration request ID
 * @body reviewedBy - Admin user ID who approved the request
 * @returns Updated registration status
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { reviewedBy } = body;

        const registration = await prisma.userRegistration.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!registration) {
            return NextResponse.json(
                { error: "Registration not found" },
                { status: 404 }
            );
        }

        if (registration.status !== "PENDING") {
            return NextResponse.json(
                { error: "Registration has already been reviewed" },
                { status: 400 }
            );
        }

        const [updatedRegistration, updatedUser] = await prisma.$transaction([
            prisma.userRegistration.update({
                where: { id },
                data: {
                    status: "APPROVED",
                    reviewedAt: new Date(),
                    reviewedBy: reviewedBy || "admin"
                }
            }),
            prisma.user.update({
                where: { id: registration.userId },
                data: {
                    isApproved: true
                }
            })
        ]);

        await prisma.auditLog.create({
            data: {
                userId: reviewedBy || "admin",
                action: "APPROVE_REGISTRATION",
                resource: "UserRegistration",
                resourceId: id,
                oldValues: JSON.stringify({ status: "PENDING", isApproved: false }),
                newValues: JSON.stringify({ status: "APPROVED", isApproved: true })
            }
        });

        return NextResponse.json({
            success: true,
            message: "Registration approved successfully",
            data: {
                registrationId: updatedRegistration.id,
                userId: updatedUser.id,
                email: updatedUser.email,
                status: updatedRegistration.status,
                reviewedAt: updatedRegistration.reviewedAt
            }
        });

    } catch (error) {
        console.error("Approval error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
