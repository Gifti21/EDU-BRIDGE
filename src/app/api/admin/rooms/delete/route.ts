import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

const deleteRoomSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
});

export async function DELETE(request: NextRequest) {
    try {
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();
        const validationResult = deleteRoomSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { roomId } = validationResult.data;

        // Check if room has schedules
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                _count: {
                    select: { schedules: true }
                }
            }
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        if (room._count.schedules > 0) {
            return NextResponse.json(
                { error: "Cannot delete room with existing schedules. Deactivate instead." },
                { status: 400 }
            );
        }

        await prisma.room.delete({ where: { id: roomId } });

        return NextResponse.json({
            success: true,
            message: "Room deleted successfully"
        });

    } catch (error) {
        console.error("Room delete error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
