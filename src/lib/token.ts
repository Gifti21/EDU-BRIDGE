/**
 * Token generation and validation utilities
 * For password reset and other secure token operations
 */

import crypto from 'crypto';

/**
 * Generate a secure random token
 * @param length - Length of the token in bytes (default: 32)
 * @returns Object with plain token and hashed token
 */
export function generateSecureToken(length: number = 32): {
    token: string;
    hashedToken: string;
} {
    // Generate random bytes
    const token = crypto.randomBytes(length).toString('hex');

    // Hash the token for storage
    const hashedToken = hashToken(token);

    return {
        token,
        hashedToken,
    };
}

/**
 * Hash a token using SHA-256
 * @param token - Plain text token
 * @returns Hashed token
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token against a hash
 * @param token - Plain text token
 * @param hashedToken - Hashed token to compare against
 * @returns True if token matches hash
 */
export function verifyTokenHash(token: string, hashedToken: string): boolean {
    const hash = hashToken(token);
    return hash === hashedToken;
}

/**
 * Generate token expiration date
 * @param hours - Number of hours until expiration (default: 24)
 * @returns Expiration date
 */
export function generateTokenExpiration(hours: number = 24): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/**
 * Check if token has expired
 * @param expiresAt - Token expiration date
 * @returns True if token has expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
}

/**
 * Generate a secure numeric OTP (One-Time Password)
 * @param length - Length of OTP (default: 6)
 * @returns Numeric OTP string
 */
export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

/**
 * Generate a URL-safe token
 * @param length - Length of the token in bytes (default: 32)
 * @returns URL-safe token string
 */
export function generateUrlSafeToken(length: number = 32): string {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
