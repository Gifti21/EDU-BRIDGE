import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        await requireRole(["ADMINISTRATOR"]);

        const settings = await prisma.systemSetting.findMany();

        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json({ settings: settingsObject });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await requireRole(["ADMINISTRATOR"]);

        const body = await request.json();
        const { settings } = body;

        if (!settings || typeof settings !== "object") {
            return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
        }

        const updates = Object.entries(settings).map(([key, value]) =>
            prisma.systemSetting.upsert({
                where: { key },
                update: {
                    value: String(value),
                    updatedAt: new Date()
                },
                create: {
                    key,
                    value: String(value),
                    type: typeof value === "boolean" ? "boolean" : "string",
                    category: "general"
                }
            })
        );

        await Promise.all(updates);

        return NextResponse.json({
            success: true,
            message: "Settings saved successfully"
        });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
