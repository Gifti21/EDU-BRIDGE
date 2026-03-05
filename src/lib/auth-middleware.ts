/**
 * Authentication Middleware Utilities
 * Handles token refresh and session validation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    verifyToken,
    shouldRefreshToken,
    refreshToken,
    AUTH_CONFIG,
    getRoleRedirectPath,
} from './auth-config';

/**
 * Validate and refresh token if needed
 * @param request - Next.js request object
 * @returns Response with refreshed token if needed, or null if valid
 */
export function validateAndRefreshToken(
    request: NextRequest
): NextResponse | null {
    const token = request.cookies.get(AUTH_CONFIG.cookieName)?.value;

    if (!token) {
        return null;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        // Token is invalid, clear cookie
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete(AUTH_CONFIG.cookieName);
        return response;
    }

    // Check if token needs refresh
    if (shouldRefreshToken(decoded)) {
        // Determine if this was a "remember me" session
        const isRememberMe = decoded.exp
            ? decoded.exp - (decoded.iat || 0) > AUTH_CONFIG.sessionDuration
            : false;

        // Generate new token
        const newToken = refreshToken(decoded, isRememberMe);

        // Continue with request but set new token
        const response = NextResponse.next();
        response.cookies.set(AUTH_CONFIG.cookieName, newToken, {
            ...AUTH_CONFIG.cookieOptions,
            maxAge: isRememberMe
                ? AUTH_CONFIG.rememberMeDuration
                : AUTH_CONFIG.sessionDuration,
        });

        return response;
    }

    return null;
}

/**
 * Check if user has required role
 * @param request - Next.js request object
 * @param allowedRoles - Array of allowed roles
 * @returns Response with redirect if unauthorized, or null if authorized
 */
export function checkRoleAccess(
    request: NextRequest,
    allowedRoles: string[]
): NextResponse | null {
    const token = request.cookies.get(AUTH_CONFIG.cookieName)?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete(AUTH_CONFIG.cookieName);
        return response;
    }

    // Check if user is approved
    if (!decoded.isApproved) {
        return NextResponse.redirect(
            new URL('/auth/pending-approval', request.url)
        );
    }

    // Check if user has required role
    if (!allowedRoles.includes(decoded.role)) {
        // Redirect to user's appropriate dashboard
        return NextResponse.redirect(
            new URL(getRoleRedirectPath(decoded.role), request.url)
        );
    }

    return null;
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/pending-approval',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
];

/**
 * Check if route is public
 * @param pathname - Request pathname
 * @returns True if route is public
 */
export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Role-based route configuration
 */
export const ROLE_ROUTES = {
    STUDENT: ['/student'],
    PARENT: ['/parent'],
    TEACHER: ['/teacher'],
    ADMINISTRATOR: ['/admin'],
    FINANCER: ['/financer'],
} as const;

/**
 * Get allowed roles for a route
 * @param pathname - Request pathname
 * @returns Array of allowed roles or null if route is not role-specific
 */
export function getAllowedRolesForRoute(pathname: string): string[] | null {
    for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
        if (routes.some((route) => pathname.startsWith(route))) {
            return [role];
        }
    }
    return null;
}

/**
 * Audit log entry for authentication events
 */
export interface AuthAuditLog {
    userId?: string;
    email?: string;
    action: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    success: boolean;
    errorMessage?: string;
}

/**
 * Create audit log entry
 * @param request - Next.js request object
 * @param action - Action being performed
 * @param userId - User ID if available
 * @param success - Whether action was successful
 * @param errorMessage - Error message if failed
 * @returns Audit log entry
 */
export function createAuthAuditLog(
    request: NextRequest,
    action: string,
    userId?: string,
    success: boolean = true,
    errorMessage?: string
): AuthAuditLog {
    return {
        userId,
        action,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        timestamp: new Date(),
        success,
        errorMessage,
    };
}
