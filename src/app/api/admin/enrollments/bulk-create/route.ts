import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";
import { z } from "zod";

// Bulk enrollment validation schema
const bulkEnrollmentSchema = z.object({
    studentIds: z.array(z.string()).min(1, "At least one student ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    academicYear: z.string().min(1, "Academic year is required"),
    semester: z.string().min(1, "Semester is required"),
    skipPrerequisiteCheck: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const body = await request.json();

        // Validate the request data
        const validationResult = bulkEnrollmentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { studentIds, courseId, academicYear, semester, skipPrerequisiteCheck } = validationResult.data;

        // Verify course exists and is active
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                prerequisites: {
                    include: {
                        prerequisite: true
                    }
                }
            }
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

        // Verify all students exist
        const students = await prisma.studentProfile.findMany({
            where: {
                id: {
                    in: studentIds
                }
            },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (students.length !== studentIds.length) {
            return NextResponse.json(
                { error: "One or more students not found" },
                { status: 404 }
            );
        }

        const results = {
            successful: [] as any[],
            failed: [] as any[],
            skipped: [] as any[]
        };

        // Process each student
        for (const student of students) {
            try {
                // Check if already enrolled
                const existingEnrollment = await prisma.courseEnrollment.findUnique({
                    where: {
                        studentId_courseId_academicYear_semester: {
                            studentId: student.id,
                            courseId,
                            academicYear,
                            semester
                        }
                    }
                });

                if (existingEnrollment) {
                    results.skipped.push({
                        studentId: student.studentId,
                        name: `${student.user.profile?.firstName} ${student.user.profile?.lastName}`,
                        reason: "Already enrolled"
                    });
                    continue;
                }

                // Check prerequisites if not skipped
                if (!skipPrerequisiteCheck && course.prerequisites.length > 0) {
                    const completedEnrollments = await prisma.courseEnrollment.findMany({
                        where: {
                            studentId: student.id,
                            status: 'COMPLETED',
                            finalGrade: {
                                not: 'F'
                            }
                        },
                        select: {
                            courseId: true
                        }
                    });

                    const completedCourseIds = completedEnrollments.map(e => e.courseId);
                    const missingPrereqs = course.prerequisites.filter(
                        prereq => !completedCourseIds.includes(prereq.prerequisiteId)
                    );

                    if (missingPrereqs.length > 0) {
                        results.failed.push({
                            studentId: student.studentId,
                            name: `${student.user.profile?.firstName} ${student.user.profile?.lastName}`,
                            reason: "Missing prerequisites",
                            missingPrerequisites: missingPrereqs.map(p => ({
                                courseCode: p.prerequisite.courseCode,
                                courseName: p.prerequisite.courseName
                            }))
                        });
                        continue;
                    }
                }

                // Create enrollment
                const enrollment = await prisma.courseEnrollment.create({
                    data: {
                        studentId: student.id,
                        courseId,
                        academicYear,
                        semester,
                        status: 'ACTIVE'
                    }
                });

                results.successful.push({
                    enrollmentId: enrollment.id,
                    studentId: student.studentId,
                    name: `${student.user.profile?.firstName} ${student.user.profile?.lastName}`,
                    email: student.user.email
                });

            } catch (error) {
                results.failed.push({
                    studentId: student.studentId,
                    name: `${student.user.profile?.firstName} ${student.user.profile?.lastName}`,
                    reason: "Enrollment failed",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        console.log(`[Admin] Bulk enrollment: ${results.successful.length} successful, ${results.failed.length} failed, ${results.skipped.length} skipped`);

        return NextResponse.json({
            success: true,
            message: `Bulk enrollment completed: ${results.successful.length} enrolled, ${results.failed.length} failed, ${results.skipped.length} skipped`,
            data: {
                course: {
                    courseCode: course.courseCode,
                    courseName: course.courseName
                },
                academicYear,
                semester,
                summary: {
                    total: studentIds.length,
                    successful: results.successful.length,
                    failed: results.failed.length,
                    skipped: results.skipped.length
                },
                results
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Bulk enrollment error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
