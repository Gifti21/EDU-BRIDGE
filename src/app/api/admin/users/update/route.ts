import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function PUT(request: NextRequest) {
    try {
        await requireRole(["ADMINISTRATOR"]);

        const body = await request.json();
        const { id, name, email, role, phone, address, dateOfBirth } = body;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                phone,
                address,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            },
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
