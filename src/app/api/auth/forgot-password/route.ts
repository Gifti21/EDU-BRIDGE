import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { passwordResetRequestSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";
import { generateSecureToken, generateTokenExpiration } from "@/lib/token";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request data using centralized schema
        const validationResult = passwordResetRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { email } = validationResult.data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                profile: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        // Always return success to prevent email enumeration
        // (Don't reveal if email exists or not)
        if (!user) {
            console.log(`[Security] Password reset requested for non-existent email: ${email}`);
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, you will receive password reset instructions."
            }, { status: 200 });
        }

        // Generate secure reset token using utility function
        const { token: resetToken, hashedToken } = generateSecureToken();

        // Token expires in 24 hours
        const expiresAt = generateTokenExpiration(24);

        // Save hashed token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: hashedToken,
                passwordResetExpires: expiresAt
            }
        });

        // Create reset URL
        const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
        const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

        // Send password reset email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request - E-Student Portal',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Password Reset Request</h2>
                        <p>Hello ${user.profile?.firstName} ${user.profile?.lastName},</p>
                        <p>We received a request to reset your password for your E-Student Portal account.</p>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
                        <p><strong>This link will expire in 24 hours.</strong></p>
                        <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 12px;">
                            This is an automated message from E-Student Portal. Please do not reply to this email.
                        </p>
                    </div>
                `,
                text: `
                    Password Reset Request
                    
                    Hello ${user.profile?.firstName} ${user.profile?.lastName},
                    
                    We received a request to reset your password for your E-Student Portal account.
                    
                    Click the link below to reset your password:
                    ${resetUrl}
                    
                    This link will expire in 24 hours.
                    
                    If you didn't request this password reset, please ignore this email.
                `
            });

            console.log(`[Auth] Password reset email sent to: ${user.email}`);
        } catch (emailError) {
            console.error('[Auth] Failed to send password reset email:', emailError);
            // Continue anyway - token is saved in database
            // Log to console as fallback
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 PASSWORD RESET EMAIL (Fallback - Email service unavailable)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`To: ${user.email}`);
            console.log(`Name: ${user.profile?.firstName} ${user.profile?.lastName}`);
            console.log(`Reset Link: ${resetUrl}`);
            console.log(`Expires: ${expiresAt.toLocaleString()}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, you will receive password reset instructions.",
            // Only include in development
            ...(process.env.NODE_ENV === 'development' && { resetUrl })
        }, { status: 200 });

    } catch (error) {
        console.error("Forgot password error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
