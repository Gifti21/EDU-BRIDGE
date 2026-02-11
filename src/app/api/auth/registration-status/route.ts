import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/auth/registration-status
 * Check the status of a user registration request
 * 
 * @query registrationId - The registration request ID
 * @query email - User's email address for verification
 * @returns Registration status information
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const registrationId = searchParams.get("registrationId");
        const email = searchParams.get("email");

        if (!registrationId || !email) {
            return NextResponse.json(
                { error: "Registration ID and email are required" },
                { status: 400 }
            );
        }

        // Find the registration with user details
        const registration = await prisma.userRegistration.findFirst({
            where: {
                id: registrationId,
                user: {
                    email: email
                }
            },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!registration) {
            return NextResponse.json(
                { error: "Registration not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: registration.id,
                email: registration.user.email,
                status: registration.status,
                firstName: registration.user.profile?.firstName,
                lastName: registration.user.profile?.lastName,
                role: registration.user.role,
                submittedAt: registration.submittedAt,
                reviewedAt: registration.reviewedAt,
                rejectionReason: registration.rejectionReason
            }
        });

    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
