import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        // Verify admin authentication
        await requireRole(['ADMINISTRATOR']);

        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parentId');
        const studentId = searchParams.get('studentId');

        // Build where clause
        const where: any = {};
        if (parentId) where.parentId = parentId;
        if (studentId) where.studentId = studentId;

        // Get relationships
        const relationships = await prisma.parentStudent.findMany({
            where,
            include: {
                parent: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                },
                student: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { isPrimary: 'desc' },
                { student: { studentId: 'asc' } }
            ]
        });

        // Format response
        const formattedRelationships = relationships.map(rel => ({
            id: rel.id,
            isPrimary: rel.isPrimary,
            parent: {
                id: rel.parentId,
                userId: rel.parent.userId,
                email: rel.parent.user.email,
                name: `${rel.parent.user.profile?.firstName} ${rel.parent.user.profile?.lastName}`,
                phone: rel.parent.user.profile?.phone,
                relationship: rel.parent.relationship
            },
            student: {
                id: rel.studentId,
                userId: rel.student.userId,
                email: rel.student.user.email,
                name: `${rel.student.user.profile?.firstName} ${rel.student.user.profile?.lastName}`,
                studentId: rel.student.studentId,
                gradeLevel: rel.student.gradeLevel,
                section: rel.student.section
            }
        }));

        return NextResponse.json({
            success: true,
            data: formattedRelationships,
            count: formattedRelationships.length
        }, { status: 200 });

    } catch (error) {
        console.error("List parent-student relationships error:", error);

        return NextResponse.json(
            { error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
