import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define role-based route access
const ROLE_ROUTES = {
    STUDENT: ['/student'],
    PARENT: ['/parent'],
    TEACHER: ['/teacher'],
    ADMINISTRATOR: ['/admin'],
    FINANCER: ['/financer'],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/pending-approval',
    '/admin/login',
    '/test-auth', // Allow test page
];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/registration-status',
    '/api/auth/logout',
];

/**
 * Proxy (middleware) to protect routes with authentication and RBAC
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Allow public API routes
    if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get token from cookie or authorization header
    const token = request.cookies.get('token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    // If no token, redirect to login
    if (!token) {
        // Log unauthorized access attempt
        console.log(`[RBAC] Unauthorized access attempt to ${pathname}`);

        // Redirect to appropriate login page
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Verify JWT token
        const decoded = verify(
            token,
            process.env.NEXTAUTH_SECRET || 'fallback-secret'
        ) as {
            userId: string;
            email: string;
            role: string;
            isApproved: boolean;
        };

        // Check if user is approved
        if (!decoded.isApproved) {
            console.log(`[RBAC] Unapproved user ${decoded.email} attempted to access ${pathname}`);
            return NextResponse.redirect(new URL('/auth/pending-approval', request.url));
        }

        // Check role-based access
        const userRole = decoded.role as keyof typeof ROLE_ROUTES;
        const allowedRoutes = ROLE_ROUTES[userRole];

        if (!allowedRoutes) {
            console.log(`[RBAC] Invalid role ${userRole} for user ${decoded.email}`);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Check if user has access to the requested route
        const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

        if (!hasAccess) {
            console.log(`[RBAC] Access denied: ${decoded.email} (${userRole}) attempted to access ${pathname}`);

            // Redirect to user's appropriate dashboard
            return NextResponse.redirect(new URL(allowedRoutes[0] + '/dashboard', request.url));
        }

        // Add user info to request headers for use in API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', decoded.userId);
        requestHeaders.set('x-user-email', decoded.email);
        requestHeaders.set('x-user-role', decoded.role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        console.error('[RBAC] Token verification failed:', error);

        // Invalid token, redirect to login
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

// Configure which routes to run proxy on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (handled separately)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|pictures|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
    ],
};
