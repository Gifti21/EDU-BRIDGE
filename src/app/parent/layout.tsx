import { requireRole } from '@/lib/auth-check';

export default async function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require PARENT role - will redirect if not authenticated or wrong role
    await requireRole(['PARENT'], '/auth/login');

    return <>{children}</>;
}
