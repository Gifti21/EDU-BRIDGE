import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

const createRoomSchema = z.object({
    roomNumber: z.string().min(1, "Room number is required"),
    building: z.string().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    type: z.enum(["CLASSROOM", "LAB", "AUDITORIUM", "LIBRARY", "GYM", "OFFICE"]),
    equipment: z.array(z.string()).optional().default([]),
    maintenanceNote: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();
        const validationResult = createRoomSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Check if room number already exists
        const existingRoom = await prisma.room.findUnique({
            where: { roomNumber: data.roomNumber }
        });

        if (existingRoom) {
            return NextResponse.json(
                { error: "Room with this number already exists" },
                { status: 409 }
            );
        }

        // Create room
        const room = await prisma.room.create({
            data: {
                roomNumber: data.roomNumber,
                building: data.building,
                capacity: data.capacity,
                type: data.type,
                equipment: JSON.stringify(data.equipment),
                maintenanceNote: data.maintenanceNote,
                isActive: true
            }
        });

        console.log(`[Admin] Room created: ${room.roomNumber}`);

        return NextResponse.json({
            success: true,
            message: "Room created successfully",
            data: {
                id: room.id,
                roomNumber: room.roomNumber,
                building: room.building,
                capacity: room.capacity,
                type: room.type,
                equipment: JSON.parse(room.equipment || '[]'),
                isActive: room.isActive
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Room creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
