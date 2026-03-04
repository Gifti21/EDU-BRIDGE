import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/registrations/bulk-approve
 * Approve multiple registration requests at once
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { registrationIds, adminId } = body;

        if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
            return NextResponse.json(
                { error: "Registration IDs array is required" },
                { status: 400 }
            );
        }

        // Find all pending registrations
        const registrations = await prisma.userRegistration.findMany({
            where: {
                id: { in: registrationIds },
                status: "PENDING"
            }
        });

        if (registrations.length === 0) {
            return NextResponse.json(
                { error: "No pending registrations found" },
                { status: 404 }
            );
        }

        const userIds = registrations.map(r => r.userId);
        const now = new Date();

        // Bulk update in transaction
        await prisma.$transaction([
            prisma.userRegistration.updateMany({
                where: { id: { in: registrationIds } },
                data: {
                    status: "APPROVED",
                    reviewedAt: now,
                    reviewedBy: adminId
                }
            }),
            prisma.user.updateMany({
                where: { id: { in: userIds } },
                data: {
                    isApproved: true,
                    approvedBy: adminId,
                    approvedAt: now
                }
            })
        ]);

        // TODO: Send bulk approval email notifications

        return NextResponse.json({
            success: true,
            message: `Successfully approved ${registrations.length} registrations`,
            count: registrations.length
        });

    } catch (error) {
        console.error("Bulk approval error:", error);
        return NextResponse.json(
            { error: "Failed to approve registrations" },
            { status: 500 }
        );
    }
}
