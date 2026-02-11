/**
 * Logo Component for E-STUDENT PORTAL
 * Beautiful, scalable SVG logo with animation support
 */

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    animated?: boolean;
}

/**
 * Logo Component
 * Displays the E-Student Portal logo with optional animations
 * 
 * @param className - Additional CSS classes
 * @param size - Logo size variant
 * @param animated - Whether to show hover animations
 */
export function Logo({ className, size = "md", animated = false }: LogoProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    return (
        <div className={cn(
            "flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600",
            sizeClasses[size],
            animated && "hover:scale-110 transition-transform duration-300",
            className
        )}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-2/3 h-2/3 text-white"
            >
                {/* Graduation Cap */}
                <path
                    d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
                    fill="currentColor"
                    className={animated ? "animate-bounce-in" : ""}
                />
                {/* Book Pages */}
                <path
                    d="M5 13.18V17.18C5 19.45 8.13 21 12 21C15.87 21 19 19.45 19 17.18V13.18L12 17L5 13.18Z"
                    fill="currentColor"
                    opacity="0.8"
                    className={animated ? "animate-fade-in" : ""}
                />
                {/* Decorative Elements */}
                <circle
                    cx="12"
                    cy="9"
                    r="1"
                    fill="white"
                    opacity="0.6"
                    className={animated ? "animate-pulse" : ""}
                />
            </svg>
        </div>
    );
}

/**
 * Logo with Text Component
 * Displays logo alongside the brand name
 */
interface LogoWithTextProps extends LogoProps {
    showTagline?: boolean;
}

export function LogoWithText({
    className,
    size = "md",
    animated = false,
    showTagline = false
}: LogoWithTextProps) {
    return (
        <div className={cn("flex items-center space-x-3", className)}>
            <Logo size={size} animated={animated} />
            <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">E-Student Portal</span>
                {showTagline && (
                    <span className="text-xs text-gray-500">Complete School Management</span>
                )}
            </div>
        </div>
    );
}