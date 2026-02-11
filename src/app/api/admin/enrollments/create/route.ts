import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Enrollment creation validation schema
const createEnrollmentSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    academicYear: z.string().min(1, "Academic year is required"),
    semester: z.string().min(1, "Semester is required"),
});

/**
 * Check if student has completed all prerequisites for a course
 */
async function validatePrerequisites(studentId: string, courseId: string): Promise<{
    valid: boolean;
    missingPrerequisites: any[];
}> {
    // Get course prerequisites
    const coursePrereqs = await prisma.coursePrerequisite.findMany({
        where: { courseId },
        include: {
            prerequisite: true
        }
    });

    if (coursePrereqs.length === 0) {
        return { valid: true, missingPrerequisites: [] };
    }

    // Get student's completed courses (with passing grades)
    const completedEnrollments = await prisma.courseEnrollment.findMany({
        where: {
            studentId,
            status: 'COMPLETED',
            finalGrade: {
                not: 'F' // Assuming F is failing grade
            }
        },
        select: {
            courseId: true
        }
    });

    const completedCourseIds = completedEnrollments.map(e => e.courseId);

    // Check which prerequisites are missing
    const missingPrerequisites = coursePrereqs.filter(
        prereq => !completedCourseIds.includes(prereq.prerequisiteId)
    ).map(prereq => ({
        id: prereq.prerequisite.id,
        courseCode: prereq.prerequisite.courseCode,
        courseName: prereq.prerequisite.courseName
    }));

    return {
        valid: missingPrerequisites.length === 0,
        missingPrerequisites
    };
}

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = createEnrollmentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { studentId, courseId, academicYear, semester } = validationResult.data;

        // Verify student exists
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        // Verify course exists and is active
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        if (!course.isActive) {
            return NextResponse.json(
                { error: "Course is not active" },
                { status: 400 }
            );
        }

        // Check if enrollment already exists
        const existingEnrollment = await prisma.courseEnrollment.findUnique({
            where: {
                studentId_courseId_academicYear_semester: {
                    studentId,
                    courseId,
                    academicYear,
                    semester
                }
            }
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { error: "Student is already enrolled in this course for the specified period" },
                { status: 409 }
            );
        }

        // Validate prerequisites
        const prereqCheck = await validatePrerequisites(studentId, courseId);

        if (!prereqCheck.valid) {
            return NextResponse.json(
                {
                    error: "Student has not completed required prerequisites",
                    missingPrerequisites: prereqCheck.missingPrerequisites
                },
                { status: 400 }
            );
        }

        // Create the enrollment
        const enrollment = await prisma.courseEnrollment.create({
            data: {
                studentId,
                courseId,
                academicYear,
                semester,
                status: 'ACTIVE'
            },
            include: {
                student: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                },
                course: true
            }
        });

        console.log(`[Admin] Enrollment created: ${student.studentId} -> ${course.courseCode}`);

        return NextResponse.json({
            success: true,
            message: "Student enrolled successfully",
            data: {
                id: enrollment.id,
                student: {
                    id: enrollment.studentId,
                    studentId: enrollment.student.studentId,
                    name: `${enrollment.student.user.profile?.firstName} ${enrollment.student.user.profile?.lastName}`,
                    email: enrollment.student.user.email
                },
                course: {
                    id: enrollment.courseId,
                    courseCode: enrollment.course.courseCode,
                    courseName: enrollment.course.courseName,
                    credits: enrollment.course.credits
                },
                academicYear: enrollment.academicYear,
                semester: enrollment.semester,
                status: enrollment.status,
                enrollmentDate: enrollment.enrollmentDate
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Enrollment creation error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
