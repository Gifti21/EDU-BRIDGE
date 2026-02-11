import { NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth-config";

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        }, { status: 200 });

        // Clear the token cookie using centralized configuration
        response.cookies.set(AUTH_CONFIG.cookieName, '', {
            ...AUTH_CONFIG.cookieOptions,
            maxAge: 0, // Expire immediately
        });

        return response;

    } catch (error) {
        console.error("Logout error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
