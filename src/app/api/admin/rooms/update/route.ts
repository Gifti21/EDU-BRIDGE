import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

const updateRoomSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
    roomNumber: z.string().optional(),
    building: z.string().optional(),
    capacity: z.number().min(1).optional(),
    type: z.enum(["CLASSROOM", "LAB", "AUDITORIUM", "LIBRARY", "GYM", "OFFICE"]).optional(),
    equipment: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    maintenanceNote: z.string().optional(),
});

export async function PUT(request: NextRequest) {
    try {
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();
        const validationResult = updateRoomSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { roomId, equipment, ...updateData } = validationResult.data;

        const room = await prisma.room.update({
            where: { id: roomId },
            data: {
                ...updateData,
                equipment: equipment ? JSON.stringify(equipment) : undefined
            }
        });

        return NextResponse.json({
            success: true,
            message: "Room updated successfully",
            data: {
                ...room,
                equipment: JSON.parse(room.equipment || '[]')
            }
        });

    } catch (error) {
        console.error("Room update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
