import { requireRole } from '@/lib/auth-check';

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require STUDENT role - will redirect if not authenticated or wrong role
    await requireRole(['STUDENT'], '/auth/login');

    return <>{children}</>;
}
