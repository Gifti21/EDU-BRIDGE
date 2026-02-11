import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR', 'TEACHER']);

        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');
        const gradeLevel = searchParams.get('gradeLevel');
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search');

        // Build where clause
        const where: any = {};

        if (department) where.department = department;
        if (gradeLevel) where.gradeLevel = gradeLevel;
        if (isActive !== null) where.isActive = isActive === 'true';

        if (search) {
            where.OR = [
                { courseName: { contains: search, mode: 'insensitive' } },
                { courseCode: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Get courses
        const courses = await prisma.course.findMany({
            where,
            include: {
                prerequisites: {
                    include: {
                        prerequisite: {
                            select: {
                                id: true,
                                courseCode: true,
                                courseName: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        assignments: true
                    }
                }
            },
            orderBy: [
                { department: 'asc' },
                { gradeLevel: 'asc' },
                { courseCode: 'asc' }
            ]
        });

        // Format response
        const formattedCourses = courses.map(course => ({
            id: course.id,
            courseCode: course.courseCode,
            courseName: course.courseName,
            description: course.description,
            credits: course.credits,
            gradeLevel: course.gradeLevel,
            department: course.department,
            isActive: course.isActive,
            prerequisites: course.prerequisites.map(p => ({
                id: p.prerequisite.id,
                courseCode: p.prerequisite.courseCode,
                courseName: p.prerequisite.courseName
            })),
            stats: {
                enrollmentCount: course._count.enrollments,
                assignmentCount: course._count.assignments
            },
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        }));

        return NextResponse.json({
            success: true,
            data: formattedCourses,
            count: formattedCourses.length
        }, { status: 200 });

    } catch (error) {
        console.error("List courses error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
