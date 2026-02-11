import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { emailSchema, passwordSchema } from "@/lib/validations/auth";
import { z } from "zod";

// Extended registration schema with additional fields
const extendedRegistrationSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMINISTRATOR', 'FINANCER']),
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        address: z.string().min(10, "Please provide a complete address"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request data
        const validationResult = extendedRegistrationSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, phone, password, role, address } = validationResult.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password using enhanced password utilities
        const hashedPassword = await hashPassword(password);

        // Create the user with pending approval status
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role as any,
                isApproved: false, // Requires admin approval
                profile: {
                    create: {
                        firstName,
                        lastName,
                        phone,
                        address,
                    }
                }
            },
            include: {
                profile: true
            }
        });

        // Create registration request record for admin review
        const registrationRequest = await prisma.userRegistration.create({
            data: {
                userId: user.id,
                status: "PENDING",
                submittedAt: new Date(),
            }
        });

        // TODO: Send email notification to admins about new registration
        // This would be implemented with a service like SendGrid, Resend, or Nodemailer

        // Return success response (without sensitive data)
        return NextResponse.json({
            success: true,
            message: "Registration submitted successfully",
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.profile?.firstName,
                lastName: user.profile?.lastName,
                registrationId: registrationRequest.id,
                status: registrationRequest.status
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);

        // Handle Prisma unique constraint errors
        if (error instanceof Error && error.message.includes("Unique constraint")) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}