import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/registrations/[id]/approve
 * Approve a user registration request
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const registrationId = id;
        const body = await request.json();
        const { adminId } = body;

        // Find the registration
        const registration = await prisma.userRegistration.findUnique({
            where: { id: registrationId },
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

        // Update registration and user in a transaction
        const result = await prisma.$transaction([
            prisma.userRegistration.update({
                where: { id: registrationId },
                data: {
                    status: "APPROVED",
                    reviewedAt: new Date(),
                    reviewedBy: adminId
                }
            }),
            prisma.user.update({
                where: { id: registration.userId },
                data: {
                    isApproved: true,
                    approvedBy: adminId,
                    approvedAt: new Date()
                }
            })
        ]);

        // TODO: Send approval email notification to user

        return NextResponse.json({
            success: true,
            message: "Registration approved successfully",
            data: result[0]
        });

    } catch (error) {
        console.error("Approval error:", error);
        return NextResponse.json(
            { error: "Failed to approve registration" },
            { status: 500 }
        );
    }
}
