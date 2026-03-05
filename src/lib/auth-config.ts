/**
 * Enhanced Authentication Configuration
 * Implements JWT strategy with security best practices
 */

import { JwtPayload, sign, verify } from 'jsonwebtoken';

/**
 * Authentication configuration constants
 */
export const AUTH_CONFIG = {
    // Session duration: 30 minutes of inactivity
    sessionDuration: 30 * 60, // 30 minutes in seconds
    sessionDurationMs: 30 * 60 * 1000, // 30 minutes in milliseconds

    // Remember me duration: 30 days
    rememberMeDuration: 30 * 24 * 60 * 60, // 30 days in seconds
    rememberMeDurationMs: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds

    // Token refresh threshold: refresh if less than 5 minutes remaining
    refreshThreshold: 5 * 60, // 5 minutes in seconds

    // JWT algorithm
    algorithm: 'HS256' as const,

    // Cookie settings
    cookieName: 'token',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
    },
} as const;

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
    isApproved: boolean;
    sessionId?: string;
    iat?: number;
    exp?: number;
}

/**
 * Get JWT secret from environment
 */
function getJwtSecret(): string {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        console.warn(
            '[Auth] NEXTAUTH_SECRET not set, using fallback (NOT SECURE FOR PRODUCTION)'
        );
        return 'fallback-secret-change-in-production';
    }
    return secret;
}

/**
 * Generate JWT token with enhanced security
 * @param payload - Token payload
 * @param rememberMe - Whether to use extended expiration
 * @returns Signed JWT token
 */
export function generateToken(
    payload: Omit<TokenPayload, 'iat' | 'exp'>,
    rememberMe: boolean = false
): string {
    const expiresIn = rememberMe
        ? AUTH_CONFIG.rememberMeDuration
        : AUTH_CONFIG.sessionDuration;

    const token = sign(payload, getJwtSecret(), {
        algorithm: AUTH_CONFIG.algorithm,
        expiresIn,
    });

    return token;
}

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = verify(token, getJwtSecret(), {
            algorithms: [AUTH_CONFIG.algorithm],
        }) as TokenPayload;

        return decoded;
    } catch (error) {
        if (error instanceof Error) {
            console.error('[Auth] Token verification failed:', error.message);
        }
        return null;
    }
}

/**
 * Check if token needs refresh
 * @param token - Decoded token payload
 * @returns True if token should be refreshed
 */
export function shouldRefreshToken(token: TokenPayload): boolean {
    if (!token.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = token.exp - now;

    return timeRemaining < AUTH_CONFIG.refreshThreshold;
}

/**
 * Refresh token with new expiration
 * @param oldToken - Current token payload
 * @param rememberMe - Whether to use extended expiration
 * @returns New JWT token
 */
export function refreshToken(
    oldToken: TokenPayload,
    rememberMe: boolean = false
): string {
    // Create new token with same payload but new expiration
    const newPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
        userId: oldToken.userId,
        email: oldToken.email,
        role: oldToken.role,
        isApproved: oldToken.isApproved,
        sessionId: oldToken.sessionId,
    };

    return generateToken(newPayload, rememberMe);
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}

/**
 * Role-based permission checks
 */
export const ROLE_PERMISSIONS = {
    STUDENT: [
        'view_own_grades',
        'view_own_attendance',
        'view_own_schedule',
        'view_course_materials',
        'submit_assignments',
        'send_messages',
        'view_own_payments',
    ],
    PARENT: [
        'view_child_grades',
        'view_child_attendance',
        'view_child_schedule',
        'view_payments',
        'make_payments',
        'send_messages',
        'submit_feedback',
    ],
    TEACHER: [
        'view_student_grades',
        'manage_grades',
        'view_student_attendance',
        'record_attendance',
        'view_class_schedule',
        'upload_materials',
        'manage_assignments',
        'send_messages',
    ],
    ADMINISTRATOR: [
        'manage_users',
        'manage_courses',
        'manage_schedules',
        'manage_rooms',
        'view_all_data',
        'approve_registrations',
        'manage_staff',
        'view_reports',
        'manage_announcements',
    ],
    FINANCER: [
        'view_all_payments',
        'verify_payments',
        'manage_billing',
        'view_financial_reports',
        'export_financial_data',
    ],
} as const;

/**
 * Check if user has specific permission
 * @param role - User role
 * @param permission - Permission to check
 * @returns True if user has permission
 */
export function hasPermission(
    role: keyof typeof ROLE_PERMISSIONS,
    permission: string
): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.includes(permission as Permission) : false;
}

/**
 * Get all permissions for a role
 * @param role - User role
 * @returns Array of permissions
 */
export function getRolePermissions(
    role: keyof typeof ROLE_PERMISSIONS
): readonly string[] {
    return ROLE_PERMISSIONS[role] || [];
}

/**
 * Session activity tracking
 */
export interface SessionActivity {
    userId: string;
    lastActivity: Date;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Check if session is still active based on last activity
 * @param lastActivity - Last activity timestamp
 * @returns True if session is still active
 */
export function isSessionActive(lastActivity: Date): boolean {
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivity.getTime();
    return timeSinceActivity < AUTH_CONFIG.sessionDurationMs;
}

/**
 * Get role-specific redirect path after login
 * @param role - User role
 * @returns Redirect path
 */
export function getRoleRedirectPath(role: string): string {
    const redirectPaths: Record<string, string> = {
        STUDENT: '/student/dashboard',
        PARENT: '/parent/dashboard',
        TEACHER: '/teacher/dashboard',
        ADMINISTRATOR: '/admin/dashboard',
        FINANCER: '/financer/dashboard',
    };

    return redirectPaths[role] || '/';
}
