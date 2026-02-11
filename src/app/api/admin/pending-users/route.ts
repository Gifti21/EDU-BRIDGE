import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        // In a real app, you'd verify admin authentication here
        // For now, we'll fetch all pending users

        const pendingUsers = await prisma.user.findMany({
            where: {
                isApproved: false,
                registrations: {
                    some: {
                        status: "PENDING"
                    }
                }
            },
            include: {
                profile: true,
                registrations: {
                    where: {
                        status: "PENDING"
                    },
                    orderBy: {
                        submittedAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        // Format the data for the frontend
        const formattedUsers = pendingUsers.map(user => ({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.profile?.firstName || "",
            lastName: user.profile?.lastName || "",
            phone: user.profile?.phone,
            address: user.profile?.address,
            submittedAt: user.registrations[0]?.submittedAt || user.createdAt,
            registrationId: user.registrations[0]?.id || ""
        }));

        return NextResponse.json({
            success: true,
            data: formattedUsers
        });

    } catch (error) {
        console.error("Error fetching pending users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}