/**
 * Server-side authentication check utility
 * Enhanced with JWT configuration and session management
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
    verifyToken,
    AUTH_CONFIG,
    TokenPayload,
    getRoleRedirectPath
} from './auth-config';

export interface AuthUser {
    userId: string;
    email: string;
    role: string;
    isApproved: boolean;
    sessionId?: string;
}

/**
 * Get the current authenticated user from cookies (server-side)
 */
export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONFIG.cookieName)?.value;

    if (!token) {
        return null;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return null;
    }

    return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        isApproved: decoded.isApproved,
        sessionId: decoded.sessionId,
    };
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/auth/login'): Promise<AuthUser> {
    const user = await getAuthUser();

    if (!user) {
        redirect(redirectTo);
    }

    if (!user.isApproved) {
        redirect('/auth/pending-approval');
    }

    return user;
}

/**
 * Require specific role - redirect if user doesn't have the role
 */
export async function requireRole(
    allowedRoles: string[],
    redirectTo: string = '/auth/login'
): Promise<AuthUser> {
    const user = await requireAuth(redirectTo);

    if (!allowedRoles.includes(user.role)) {
        // Redirect to user's appropriate dashboard using centralized config
        redirect(getRoleRedirectPath(user.role));
    }

    return user;
}
