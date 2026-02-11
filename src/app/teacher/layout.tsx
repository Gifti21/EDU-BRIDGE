import { requireRole } from '@/lib/auth-check';

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require TEACHER role - will redirect if not authenticated or wrong role
    await requireRole(['TEACHER'], '/auth/login');

    return <>{children}</>;
}
