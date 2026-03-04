import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/registrations/[id]/reject
 * Reject a user registration request
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const registrationId = params.id;
        const body = await request.json();
        const { adminId, reason } = body;

        if (!reason || reason.trim().length < 10) {
            return NextResponse.json(
                { error: "Rejection reason must be at least 10 characters" },
                { status: 400 }
            );
        }

        // Find the registration
        const registration = await prisma.userRegistration.findUnique({
            where: { id: registrationId }
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

        // Update registration status
        const updatedRegistration = await prisma.userRegistration.update({
            where: { id: registrationId },
            data: {
                status: "REJECTED",
                reviewedAt: new Date(),
                reviewedBy: adminId,
                rejectionReason: reason
            }
        });

        // TODO: Send rejection email notification to user with reason

        return NextResponse.json({
            success: true,
            message: "Registration rejected",
            data: updatedRegistration
        });

    } catch (error) {
        console.error("Rejection error:", error);
        return NextResponse.json(
            { error: "Failed to reject registration" },
            { status: 500 }
        );
    }
}
