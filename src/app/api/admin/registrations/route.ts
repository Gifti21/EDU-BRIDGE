import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/registrations
 * Retrieve all pending registration requests for admin review
 * 
 * @query status - Filter by status (PENDING, APPROVED, REJECTED) - optional
 * @returns List of registration requests with user details
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Add authentication check to ensure user is an ADMINISTRATOR
        // For now, we'll proceed without auth for development

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status");

        // Build query filter
        const whereClause: any = {};
        if (status) {
            whereClause.status = status;
        }

        // Fetch registrations with user and profile details
        const registrations = await prisma.userRegistration.findMany({
            where: whereClause,
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

        // Format the response data
        const formattedRegistrations = registrations.map(reg => ({
            id: reg.id,
            userId: reg.userId,
            email: reg.user.email,
            role: reg.user.role,
            firstName: reg.user.profile?.firstName,
            lastName: reg.user.profile?.lastName,
            phone: reg.user.profile?.phone,
            address: reg.user.profile?.address,
            status: reg.status,
            submittedAt: reg.submittedAt,
            reviewedAt: reg.reviewedAt,
            reviewedBy: reg.reviewedBy,
            rejectionReason: reg.rejectionReason
        }));

        return NextResponse.json({
            success: true,
            data: formattedRegistrations,
            count: formattedRegistrations.length
        });

    } catch (error) {
        console.error("Fetch registrations error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
