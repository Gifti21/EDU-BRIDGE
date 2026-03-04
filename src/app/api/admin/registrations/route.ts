import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/registrations
 * Fetch all registration requests with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status") || "PENDING";
        const role = searchParams.get("role");

        const where: any = {
            status: status
        };

        if (role) {
            where.user = {
                role: role
            };
        }

        const registrations = await prisma.userRegistration.findMany({
            where,
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });

        const formattedData = registrations.map(reg => ({
            id: reg.id,
            userId: reg.userId,
            email: reg.user.email,
            firstName: reg.user.profile?.firstName,
            lastName: reg.user.profile?.lastName,
            phone: reg.user.profile?.phone,
            address: reg.user.profile?.address,
            role: reg.user.role,
            status: reg.status,
            submittedAt: reg.submittedAt,
            reviewedAt: reg.reviewedAt,
            reviewedBy: reg.reviewedBy,
            rejectionReason: reg.rejectionReason
        }));

        return NextResponse.json({
            success: true,
            data: formattedData,
            count: formattedData.length
        });

    } catch (error) {
        console.error("Fetch registrations error:", error);
        return NextResponse.json(
            { error: "Failed to fetch registrations" },
            { status: 500 }
        );
    }
}
