import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const unlockSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        // TODO: Add admin authentication check here
        // const user = await getAuthUser();
        // if (user.role !== 'ADMINISTRATOR') return 403

        const body = await request.json();

        // Validate the request data
        const validationResult = unlockSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { userId } = validationResult.data;

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                failedLoginAttempts: true,
                accountLockedUntil: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Unlock account
        await prisma.user.update({
            where: { id: userId },
            data: {
                failedLoginAttempts: 0,
                accountLockedUntil: null
            }
        });

        console.log(`[Admin] Account unlocked: ${user.email}`);

        return NextResponse.json({
            success: true,
            message: "Account unlocked successfully",
            user: {
                id: user.id,
                email: user.email
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Unlock account error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
