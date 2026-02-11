import { requireRole } from '@/lib/auth-check';

export default async function FinancerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require FINANCER role - will redirect if not authenticated or wrong role
    await requireRole(['FINANCER'], '/auth/login');

    return <>{children}</>;
}
