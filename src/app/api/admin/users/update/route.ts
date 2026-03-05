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

        // Split name into firstName and lastName
        const nameParts = name?.split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Update user and profile
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                role,
                profile: {
                    upsert: {
                        create: {
                            firstName,
                            lastName,
                            phone,
                            address,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                        },
                        update: {
                            firstName,
                            lastName,
                            phone,
                            address,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                        }
                    }
                }
            },
            include: {
                profile: true
            }
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
