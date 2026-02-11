import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { passwordResetSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";
import { hashToken } from "@/lib/token";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request data using centralized schema
        const validationResult = passwordResetSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { token, password } = validationResult.data;

        // Hash the token to match database using utility function
        const hashedToken = hashToken(token);

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    gt: new Date() // Token not expired
                }
            },
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

        if (!user) {
            return NextResponse.json(
                {
                    error: "Invalid or expired reset token. Please request a new password reset.",
                    code: "INVALID_TOKEN"
                },
                { status: 400 }
            );
        }

        // Hash new password using enhanced password utilities
        const hashedPassword = await hashPassword(password);

        // Update password and clear reset token
        // Also invalidate all existing sessions by resetting failed attempts and unlocking account
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                failedLoginAttempts: 0, // Reset failed attempts
                accountLockedUntil: null, // Unlock account if locked
            }
        });

        console.log(`[Security] Password reset successful for: ${user.email}`);

        // Send confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Successful - E-Student Portal',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #16a34a;">Password Reset Successful</h2>
                        <p>Hello ${user.profile?.firstName} ${user.profile?.lastName},</p>
                        <p>Your password has been successfully reset for your E-Student Portal account.</p>
                        <p>You can now log in with your new password.</p>
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400e;">
                                <strong>Security Notice:</strong> If you did not make this change, 
                                please contact support immediately.
                            </p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.NEXTAUTH_URL}/auth/login" 
                               style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Go to Login
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 12px;">
                            This is an automated message from E-Student Portal. Please do not reply to this email.
                        </p>
                    </div>
                `,
                text: `
                    Password Reset Successful
                    
                    Hello ${user.profile?.firstName} ${user.profile?.lastName},
                    
                    Your password has been successfully reset for your E-Student Portal account.
                    
                    You can now log in with your new password.
                    
                    Security Notice: If you did not make this change, please contact support immediately.
                `
            });

            console.log(`[Auth] Password reset confirmation email sent to: ${user.email}`);
        } catch (emailError) {
            console.error('[Auth] Failed to send confirmation email:', emailError);
            // Continue anyway - password was already reset
            console.log(`📧 Password reset confirmation for: ${user.email} (Email service unavailable)`);
        }

        return NextResponse.json({
            success: true,
            message: "Password reset successful. You can now login with your new password."
        }, { status: 200 });

    } catch (error) {
        console.error("Reset password error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
