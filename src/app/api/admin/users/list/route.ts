import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        await requireRole(["ADMINISTRATOR"]);

        const users = await prisma.user.findMany({
            include: {
                profile: true
            },
            orderBy: { createdAt: "desc" },
        });

        // Transform users to include name from profile
        const transformedUsers = users.map(user => ({
            id: user.id,
            name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "N/A",
            email: user.email,
            role: user.role,
            status: user.isApproved ? "ACTIVE" : "PENDING",
            phone: user.profile?.phone,
            address: user.profile?.address,
            dateOfBirth: user.profile?.dateOfBirth,
            createdAt: user.createdAt,
        }));

        return NextResponse.json({ users: transformedUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
