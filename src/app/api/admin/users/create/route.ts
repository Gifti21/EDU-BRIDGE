import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateTemporaryPassword } from "@/lib/password";
import { sendEmail } from "@/lib/email";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// User creation validation schema
const createUserSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(10, "Please provide a complete address"),
    role: z.enum(["STUDENT", "PARENT", "TEACHER", "ADMINISTRATOR", "FINANCER"]),

    // Optional fields
    dateOfBirth: z.string().optional(),

    // Role-specific fields
    gradeLevel: z.string().optional(), // For students
    section: z.string().optional(), // For students
    department: z.string().optional(), // For teachers, admins, financers
    specialization: z.string().optional(), // For teachers
    relationship: z.string().optional(), // For parents
    accessLevel: z.string().optional(), // For financers
});

type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Generate unique student ID
 * Format: STU-YYYY-NNNN
 */
async function generateStudentId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `STU-${year}-`;

    // Find the latest student ID for this year
    const latestStudent = await prisma.studentProfile.findFirst({
        where: {
            studentId: {
                startsWith: prefix
            }
        },
        orderBy: {
            studentId: 'desc'
        },
        select: {
            studentId: true
        }
    });

    let nextNumber = 1;
    if (latestStudent) {
        const lastNumber = parseInt(latestStudent.studentId.split('-')[2]);
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Generate unique employee ID
 * Format: EMP-YYYY-NNNN
 */
async function generateEmployeeId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `EMP-${year}-`;

    // Find the latest employee ID for this year
    const latestEmployee = await prisma.teacherProfile.findFirst({
        where: {
            employeeId: {
                startsWith: prefix
            }
        },
        orderBy: {
            employeeId: 'desc'
        },
        select: {
            employeeId: true
        }
    });

    let nextNumber = 1;
    if (latestEmployee) {
        const lastNumber = parseInt(latestEmployee.employeeId.split('-')[2]);
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
}

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        const admin = await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = createUserSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Generate temporary password
        const temporaryPassword = generateTemporaryPassword(12);
        const hashedPassword = await hashPassword(temporaryPassword);

        // Create user with profile
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
                isApproved: true, // Admin-created users are auto-approved
                createdBy: admin.userId,
                approvedBy: admin.userId,
                approvedAt: new Date(),
                profile: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        address: data.address,
                        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                    }
                }
            }
        });

        // Create role-specific profile
        let roleProfile: any = null;

        if (data.role === 'STUDENT') {
            const studentId = await generateStudentId();
            roleProfile = await prisma.studentProfile.create({
                data: {
                    userId: user.id,
                    studentId,
                    gradeLevel: data.gradeLevel || 'Not Assigned',
                    section: data.section || null,
                    enrollmentDate: new Date(),
                }
            });
        } else if (data.role === 'TEACHER') {
            const employeeId = await generateEmployeeId();
            roleProfile = await prisma.teacherProfile.create({
                data: {
                    userId: user.id,
                    employeeId,
                    department: data.department || 'General',
                    specialization: data.specialization || null,
                    hireDate: new Date(),
                }
            });
        } else if (data.role === 'PARENT') {
            roleProfile = await prisma.parentProfile.create({
                data: {
                    userId: user.id,
                    relationship: data.relationship || 'Guardian',
                    occupation: null,
                }
            });
        } else if (data.role === 'ADMINISTRATOR') {
            roleProfile = await prisma.adminProfile.create({
                data: {
                    userId: user.id,
                    department: data.department || 'Administration',
                    permissions: JSON.stringify(['all']), // Full permissions
                }
            });
        } else if (data.role === 'FINANCER') {
            roleProfile = await prisma.financerProfile.create({
                data: {
                    userId: user.id,
                    department: data.department || 'Finance',
                    accessLevel: data.accessLevel || 'FULL_ACCESS',
                }
            });
        }

        // Send welcome email with credentials
        try {
            const loginUrl = `${process.env.NEXTAUTH_URL}/auth/login`;

            // Get user profile
            const userProfile = await prisma.userProfile.findUnique({
                where: { userId: user.id }
            });

            await sendEmail({
                to: user.email,
                subject: 'Welcome to E-Student Portal - Account Created',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Welcome to E-Student Portal!</h2>
                        <p>Hello ${userProfile?.firstName} ${userProfile?.lastName},</p>
                        <p>Your account has been created by the school administration.</p>
                        
                        <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1f2937;">Your Login Credentials</h3>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${temporaryPassword}</code></p>
                            <p style="margin: 5px 0;"><strong>Role:</strong> ${data.role}</p>
                            ${roleProfile?.studentId ? `<p style="margin: 5px 0;"><strong>Student ID:</strong> ${roleProfile.studentId}</p>` : ''}
                            ${roleProfile?.employeeId ? `<p style="margin: 5px 0;"><strong>Employee ID:</strong> ${roleProfile.employeeId}</p>` : ''}
                        </div>
                        
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #92400e;">
                                <strong>Important:</strong> Please change your password after your first login for security purposes.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}" 
                               style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Login to Your Account
                            </a>
                        </div>
                        
                        <p>If you have any questions or need assistance, please contact the school administration.</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 12px;">
                            This is an automated message from E-Student Portal. Please do not reply to this email.
                        </p>
                    </div>
                `,
                text: `
                    Welcome to E-Student Portal!
                    
                    Hello ${data.firstName} ${data.lastName},
                    
                    Your account has been created by the school administration.
                    
                    Your Login Credentials:
                    Email: ${user.email}
                    Temporary Password: ${temporaryPassword}
                    Role: ${data.role}
                    ${roleProfile?.studentId ? `Student ID: ${roleProfile.studentId}` : ''}
                    ${roleProfile?.employeeId ? `Employee ID: ${roleProfile.employeeId}` : ''}
                    
                    Important: Please change your password after your first login for security purposes.
                    
                    Login URL: ${loginUrl}
                    
                    If you have any questions or need assistance, please contact the school administration.
                `
            });

            console.log(`[Admin] Welcome email sent to: ${user.email}`);
        } catch (emailError) {
            console.error('[Admin] Failed to send welcome email:', emailError);
            // Continue anyway - user was created successfully
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 WELCOME EMAIL (Fallback - Email service unavailable)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`To: ${user.email}`);
            console.log(`Name: ${data.firstName} ${data.lastName}`);
            console.log(`Temporary Password: ${temporaryPassword}`);
            console.log(`Role: ${data.role}`);
            if (roleProfile?.studentId) console.log(`Student ID: ${roleProfile.studentId}`);
            if (roleProfile?.employeeId) console.log(`Employee ID: ${roleProfile.employeeId}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: "User created successfully",
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: data.firstName,
                lastName: data.lastName,
                studentId: roleProfile?.studentId,
                employeeId: roleProfile?.employeeId,
                temporaryPassword: process.env.NODE_ENV === 'development' ? temporaryPassword : undefined,
            }
        }, { status: 201 });

    } catch (error) {
        console.error("User creation error:", error);

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
