/**
 * Button Component for E-STUDENT PORTAL
 * Formal, functional button with multiple variants and full accessibility support
 * Includes loading states, icons, and smooth animations
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button variant styles using class-variance-authority
 * Provides consistent styling across different button types
 */
const buttonVariants = cva(
    // Base button styles with animations and accessibility
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none " +
    "disabled:opacity-50 active:scale-95 hover:scale-105",
    {
        variants: {
            variant: {
                // Primary button - main actions
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90 " +
                    "border border-primary hover:border-primary/90",

                // Destructive button - delete, remove actions
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 " +
                    "border border-destructive hover:border-destructive/90",

                // Outline button - secondary actions
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent " +
                    "hover:text-accent-foreground hover:border-accent",

                // Secondary button - alternative actions
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 " +
                    "border border-secondary hover:border-secondary/80",

                // Ghost button - minimal styling
                ghost:
                    "hover:bg-accent hover:text-accent-foreground border border-transparent " +
                    "hover:border-accent",

                // Link button - text-only styling
                link:
                    "text-primary underline-offset-4 hover:underline border-none shadow-none " +
                    "hover:scale-100 active:scale-100",

                // Success button - positive actions
                success:
                    "bg-green-600 text-white shadow hover:bg-green-700 " +
                    "border border-green-600 hover:border-green-700",

                // Warning button - caution actions
                warning:
                    "bg-yellow-600 text-white shadow hover:bg-yellow-700 " +
                    "border border-yellow-600 hover:border-yellow-700",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                xl: "h-12 rounded-lg px-10 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

/**
 * Button component props interface
 * Extends HTML button attributes with custom props
 */
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

/**
 * Button Component
 * Formal, functional button with comprehensive features
 * 
 * Features:
 * - Multiple variants (primary, secondary, destructive, etc.)
 * - Loading states with spinner animation
 * - Icon support with positioning
 * - Full accessibility support
 * - Smooth hover and click animations
 * - Keyboard navigation support
 * 
 * @param className - Additional CSS classes
 * @param variant - Button style variant
 * @param size - Button size
 * @param asChild - Render as child component (for links)
 * @param loading - Show loading state
 * @param loadingText - Text to show when loading
 * @param icon - Icon to display
 * @param iconPosition - Position of icon (left or right)
 * @param disabled - Disable button
 * @param children - Button content
 * @param props - Additional HTML button props
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            loading = false,
            loadingText,
            icon,
            iconPosition = "left",
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        // Use Slot for asChild functionality (useful for Next.js Link components)
        const Comp = asChild ? Slot : "button";

        // Determine if button should be disabled (loading or explicitly disabled)
        const isDisabled = disabled || loading;

        // Render icon with proper positioning
        const renderIcon = () => {
            if (loading) {
                return <Loader2 className="h-4 w-4 animate-spin" />;
            }
            if (icon) {
                return <span className="flex items-center justify-center">{icon}</span>;
            }
            return null;
        };

        // Determine button content based on loading state
        const buttonContent = loading && loadingText ? loadingText : children;

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isDisabled}
                {...props}
            >
                {/* Render icon on the left */}
                {iconPosition === "left" && renderIcon()}

                {/* Button text content */}
                {buttonContent && (
                    <span className={cn(
                        "flex items-center justify-center",
                        (icon || loading) && iconPosition === "left" && "ml-1",
                        (icon || loading) && iconPosition === "right" && "mr-1"
                    )}>
                        {buttonContent}
                    </span>
                )}

                {/* Render icon on the right */}
                {iconPosition === "right" && renderIcon()}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };