import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations/auth";
import { generateToken, AUTH_CONFIG, getRoleRedirectPath } from "@/lib/auth-config";
import { z } from "zod";

// Extended login schema with rememberMe
const extendedLoginSchema = loginSchema.extend({
    rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request data
        const validationResult = extendedLoginSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { email, password, rememberMe } = validationResult.data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                registrations: {
                    orderBy: { submittedAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
            const minutesRemaining = Math.ceil(
                (user.accountLockedUntil.getTime() - new Date().getTime()) / (1000 * 60)
            );
            return NextResponse.json(
                {
                    error: `Account is locked due to too many failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
                    code: "ACCOUNT_LOCKED",
                    lockedUntil: user.accountLockedUntil
                },
                { status: 403 }
            );
        }

        // Check if user is approved
        if (!user.isApproved) {
            // Check registration status
            const latestRegistration = user.registrations[0];
            const status = latestRegistration?.status || "PENDING";

            if (status === "REJECTED") {
                return NextResponse.json(
                    {
                        error: "Your registration has been rejected. Please contact the school administration or register again.",
                        code: "REGISTRATION_REJECTED"
                    },
                    { status: 403 }
                );
            } else {
                return NextResponse.json(
                    {
                        error: "Your account is pending approval. Please wait for administrator approval.",
                        code: "PENDING_APPROVAL"
                    },
                    { status: 403 }
                );
            }
        }

        // Verify password using enhanced password utilities
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            // Increment failed login attempts
            const failedAttempts = user.failedLoginAttempts + 1;
            const maxAttempts = 5;
            const lockoutDuration = 15; // minutes

            // Lock account if max attempts reached
            if (failedAttempts >= maxAttempts) {
                const lockoutUntil = new Date(Date.now() + lockoutDuration * 60 * 1000);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedLoginAttempts: failedAttempts,
                        accountLockedUntil: lockoutUntil
                    }
                });

                console.log(`[Security] Account locked: ${email} - Too many failed attempts`);

                return NextResponse.json(
                    {
                        error: `Account locked due to too many failed login attempts. Please try again in ${lockoutDuration} minutes.`,
                        code: "ACCOUNT_LOCKED",
                        lockedUntil: lockoutUntil
                    },
                    { status: 403 }
                );
            }

            // Update failed attempts count
            await prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: failedAttempts }
            });

            const attemptsRemaining = maxAttempts - failedAttempts;

            return NextResponse.json(
                {
                    error: "Invalid email or password",
                    attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
                },
                { status: 401 }
            );
        }

        // Successful login - reset failed attempts and unlock account
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                failedLoginAttempts: 0,
                accountLockedUntil: null
            }
        });

        // Generate JWT token with enhanced security configuration
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            sessionId: `${user.id}-${Date.now()}`, // Unique session identifier
        };

        const token = generateToken(tokenPayload, rememberMe);

        // Create response with token cookie
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.profile?.firstName,
                lastName: user.profile?.lastName,
                avatar: user.profile?.avatar,
                isApproved: user.isApproved,
                lastLoginAt: user.lastLoginAt
            },
            redirectTo: getRoleRedirectPath(user.role)
        }, { status: 200 });

        // Set HTTP-only cookie with enhanced security settings
        const maxAge = rememberMe
            ? AUTH_CONFIG.rememberMeDuration
            : AUTH_CONFIG.sessionDuration;

        response.cookies.set(AUTH_CONFIG.cookieName, token, {
            ...AUTH_CONFIG.cookieOptions,
            maxAge,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}