/**
 * Authentication validation schemas using Zod
 */

import { z } from 'zod';
import { PASSWORD_REQUIREMENTS } from '../password';

/**
 * Password validation schema
 */
export const passwordSchema = z
    .string()
    .min(
        PASSWORD_REQUIREMENTS.minLength,
        `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`
    )
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        'Password must contain at least one special character'
    );

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Login schema
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

/**
 * Registration schema
 */
export const registrationSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMINISTRATOR', 'FINANCER']),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
    email: emailSchema,
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z
    .object({
        token: z.string().min(1, 'Reset token is required'),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

/**
 * Password reset form schema (without token)
 */
export const passwordResetFormSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

/**
 * Change password schema
 */
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must be different from current password',
        path: ['newPassword'],
    });

/**
 * Type exports
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type PasswordResetRequestInput = z.infer<
    typeof passwordResetRequestSchema
>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordResetFormInput = z.infer<typeof passwordResetFormSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
