/**
 * Input Component for E-STUDENT PORTAL
 * Accessible form input with validation states and animations
 * Supports various input types and visual feedback
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Input variant styles for different states and types
 */
const inputVariants = cva(
    // Base input styles with transitions and accessibility
    "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm " +
    "transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium " +
    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 " +
    "disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                // Default input styling
                default:
                    "border-input focus-visible:ring-ring hover:border-ring/50",

                // Success state - valid input
                success:
                    "border-green-500 focus-visible:ring-green-500 hover:border-green-600",

                // Error state - invalid input
                error:
                    "border-red-500 focus-visible:ring-red-500 hover:border-red-600 " +
                    "bg-red-50 dark:bg-red-950/20",

                // Warning state - needs attention
                warning:
                    "border-yellow-500 focus-visible:ring-yellow-500 hover:border-yellow-600 " +
                    "bg-yellow-50 dark:bg-yellow-950/20",
            },
            size: {
                sm: "h-8 px-2 text-xs",
                default: "h-9 px-3",
                lg: "h-10 px-4 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

/**
 * Input component props interface
 */
export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    error?: string;
    success?: string;
    warning?: string;
    label?: string;
    description?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showPasswordToggle?: boolean;
}

/**
 * Input Component
 * Comprehensive form input with validation and accessibility features
 * 
 * Features:
 * - Multiple variants (default, success, error, warning)
 * - Label and description support
 * - Icon support (left and right)
 * - Password visibility toggle
 * - Validation message display
 * - Full accessibility support
 * - Smooth animations and transitions
 * 
 * @param className - Additional CSS classes
 * @param variant - Input style variant
 * @param size - Input size
 * @param type - Input type
 * @param error - Error message to display
 * @param success - Success message to display
 * @param warning - Warning message to display
 * @param label - Input label
 * @param description - Input description/help text
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 * @param showPasswordToggle - Show password visibility toggle for password inputs
 * @param disabled - Disable input
 * @param props - Additional HTML input props
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            variant,
            size,
            type = "text",
            error,
            success,
            warning,
            label,
            description,
            leftIcon,
            rightIcon,
            showPasswordToggle = false,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        // State for password visibility toggle
        const [showPassword, setShowPassword] = React.useState(false);

        // Generate unique ID if not provided
        const inputId = id || React.useId();

        // Determine current variant based on validation state
        const currentVariant = error ? "error" : success ? "success" : warning ? "warning" : variant;

        // Determine actual input type (handle password toggle)
        const inputType = type === "password" && showPassword ? "text" : type;

        // Toggle password visibility
        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="space-y-2">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}

                {/* Input container with icons */}
                <div className="relative">
                    {/* Left icon */}
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {leftIcon}
                        </div>
                    )}

                    {/* Main input element */}
                    <input
                        type={inputType}
                        className={cn(
                            inputVariants({ variant: currentVariant, size, className }),
                            leftIcon && "pl-10",
                            (rightIcon || (type === "password" && showPasswordToggle)) && "pr-10"
                        )}
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        {...props}
                    />

                    {/* Right icon or password toggle */}
                    {(rightIcon || (type === "password" && showPasswordToggle)) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {type === "password" && showPasswordToggle ? (
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            ) : (
                                <div className="text-muted-foreground">{rightIcon}</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                {description && !error && !success && !warning && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}

                {/* Validation messages */}
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-green-600 dark:text-green-400 animate-fade-in">
                        {success}
                    </p>
                )}

                {warning && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 animate-fade-in">
                        {warning}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

/**
 * Textarea Component
 * Multi-line text input with similar features to Input
 */
export interface TextareaProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    error?: string;
    success?: string;
    warning?: string;
    label?: string;
    description?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            variant,
            error,
            success,
            warning,
            label,
            description,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        // Generate unique ID if not provided
        const textareaId = id || React.useId();

        // Determine current variant based on validation state
        const currentVariant = error ? "error" : success ? "success" : warning ? "warning" : variant;

        return (
            <div className="space-y-2">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}

                {/* Textarea element */}
                <textarea
                    className={cn(
                        inputVariants({ variant: currentVariant, className }),
                        "min-h-[60px] resize-y"
                    )}
                    ref={ref}
                    id={textareaId}
                    disabled={disabled}
                    {...props}
                />

                {/* Description */}
                {description && !error && !success && !warning && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}

                {/* Validation messages */}
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-green-600 dark:text-green-400 animate-fade-in">
                        {success}
                    </p>
                )}

                {warning && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 animate-fade-in">
                        {warning}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { Input, Textarea, inputVariants };