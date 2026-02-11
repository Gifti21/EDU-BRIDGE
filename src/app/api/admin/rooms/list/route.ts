import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        await requireRole(['ADMINISTRATOR', 'TEACHER']);

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const building = searchParams.get('building');
        const isActive = searchParams.get('isActive');

        const where: any = {};
        if (type) where.type = type;
        if (building) where.building = building;
        if (isActive !== null) where.isActive = isActive === 'true';

        const rooms = await prisma.room.findMany({
            where,
            include: {
                _count: {
                    select: {
                        schedules: true
                    }
                }
            },
            orderBy: [
                { building: 'asc' },
                { roomNumber: 'asc' }
            ]
        });

        const formattedRooms = rooms.map(room => ({
            id: room.id,
            roomNumber: room.roomNumber,
            building: room.building,
            capacity: room.capacity,
            type: room.type,
            equipment: JSON.parse(room.equipment || '[]'),
            isActive: room.isActive,
            maintenanceNote: room.maintenanceNote,
            scheduleCount: room._count.schedules
        }));

        return NextResponse.json({
            success: true,
            data: formattedRooms,
            count: formattedRooms.length
        });

    } catch (error) {
        console.error("List rooms error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
