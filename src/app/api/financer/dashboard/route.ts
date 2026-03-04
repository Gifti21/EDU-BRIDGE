import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
    try {
        const user = await requireRole(['FINANCER']);

        // Get financer profile
        const financerProfile = await prisma.financerProfile.findUnique({
            where: { userId: user.userId },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!financerProfile) {
            return NextResponse.json(
                { error: "Financer profile not found" },
                { status: 404 }
            );
        }

        // Get payment statistics
        const allPayments = await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        const totalPayments = allPayments.length;
        const completedPayments = allPayments.filter(p => p.status === 'COMPLETED');
        const pendingPayments = allPayments.filter(p => p.status === 'PENDING');
        const failedPayments = allPayments.filter(p => p.status === 'FAILED');

        const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

        // Get recent payments
        const recentPayments = await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
                parent: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                }
            }
        });

        // Get billing statements
        const billingStatements = await prisma.billingStatement.findMany({
            orderBy: { generatedAt: 'desc' },
            take: 20
        });

        const unpaidStatements = billingStatements.filter(b => b.status === 'UNPAID' || b.status === 'PARTIAL');
        const overdueStatements = billingStatements.filter(b => b.status === 'OVERDUE');
        const totalOutstanding = unpaidStatements.reduce((sum, b) => sum + b.balance, 0);

        // Get fee structures
        const feeStructures = await prisma.feeStructure.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        // Payment method breakdown
        const paymentsByMethod = completedPayments.reduce((acc, payment) => {
            acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
            return acc;
        }, {} as Record<string, number>);

        // Fee type breakdown
        const paymentsByFeeType = completedPayments.reduce((acc, payment) => {
            acc[payment.feeType] = (acc[payment.feeType] || 0) + payment.amount;
            return acc;
        }, {} as Record<string, number>);

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = completedPayments
            .filter(p => p.paidAt && p.paidAt >= sixMonthsAgo)
            .reduce((acc, payment) => {
                if (payment.paidAt) {
                    const month = payment.paidAt.toISOString().substring(0, 7); // YYYY-MM
                    acc[month] = (acc[month] || 0) + payment.amount;
                }
                return acc;
            }, {} as Record<string, number>);

        return NextResponse.json({
            success: true,
            data: {
                financer: {
                    id: financerProfile.id,
                    name: `${financerProfile.user.profile?.firstName} ${financerProfile.user.profile?.lastName}`,
                    email: financerProfile.user.email,
                    department: financerProfile.department,
                    accessLevel: financerProfile.accessLevel
                },
                statistics: {
                    totalPayments,
                    completedPayments: completedPayments.length,
                    pendingPayments: pendingPayments.length,
                    failedPayments: failedPayments.length,
                    totalRevenue,
                    pendingAmount,
                    totalOutstanding,
                    unpaidStatements: unpaidStatements.length,
                    overdueStatements: overdueStatements.length
                },
                recentPayments: recentPayments.map(payment => ({
                    id: payment.id,
                    studentId: payment.studentId,
                    parentName: payment.parent
                        ? `${payment.parent.user.profile?.firstName} ${payment.parent.user.profile?.lastName}`
                        : 'N/A',
                    amount: payment.amount,
                    feeType: payment.feeType,
                    paymentMethod: payment.paymentMethod,
                    status: payment.status,
                    transactionId: payment.transactionId,
                    receiptNumber: payment.receiptNumber,
                    paidAt: payment.paidAt,
                    verifiedAt: payment.verifiedAt,
                    verifiedBy: payment.verifiedBy,
                    createdAt: payment.createdAt
                })),
                billingStatements: billingStatements.map(statement => ({
                    id: statement.id,
                    studentId: statement.studentId,
                    academicYear: statement.academicYear,
                    semester: statement.semester,
                    totalAmount: statement.totalAmount,
                    paidAmount: statement.paidAmount,
                    balance: statement.balance,
                    dueDate: statement.dueDate,
                    status: statement.status,
                    generatedAt: statement.generatedAt
                })),
                feeStructures: feeStructures.map(fee => ({
                    id: fee.id,
                    name: fee.name,
                    description: fee.description,
                    amount: fee.amount,
                    gradeLevel: fee.gradeLevel,
                    feeType: fee.feeType,
                    frequency: fee.frequency,
                    academicYear: fee.academicYear
                })),
                analytics: {
                    paymentsByMethod,
                    paymentsByFeeType,
                    monthlyRevenue
                }
            }
        });

    } catch (error) {
        console.error("Financer dashboard error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
