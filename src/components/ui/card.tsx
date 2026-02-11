/**
 * Card Components for E-STUDENT PORTAL
 * Flexible card system with interactive animations and consistent styling
 * Used for dashboard widgets, forms, and content containers
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Card variant styles for different use cases
 */
const cardVariants = cva(
    "rounded-lg border bg-card text-card-foreground shadow-card transition-all duration-200",
    {
        variants: {
            variant: {
                // Default card styling
                default: "hover:shadow-card-hover",

                // Interactive card with hover effects
                interactive: "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",

                // Dashboard widget styling
                dashboard: "hover:shadow-dashboard",

                // Elevated card with more prominent shadow
                elevated: "shadow-lg hover:shadow-xl",

                // Flat card with minimal shadow
                flat: "shadow-none border-2",

                // Glass morphism effect
                glass: "glass backdrop-blur-sm",
            },
            padding: {
                none: "p-0",
                sm: "p-4",
                default: "p-6",
                lg: "p-8",
            },
        },
        defaultVariants: {
            variant: "default",
            padding: "default",
        },
    }
);

/**
 * Card component props interface
 */
export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    asChild?: boolean;
}

/**
 * Main Card Component
 * Flexible container with consistent styling and animations
 * 
 * @param className - Additional CSS classes
 * @param variant - Card style variant
 * @param padding - Card padding size
 * @param children - Card content
 * @param props - Additional HTML div props
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, padding, className }))}
            {...props}
        />
    )
);
Card.displayName = "Card";

/**
 * Card Header Component
 * Contains title and optional description
 * 
 * @param className - Additional CSS classes
 * @param children - Header content
 * @param props - Additional HTML div props
 */
const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

/**
 * Card Title Component
 * Main heading for the card
 * 
 * @param className - Additional CSS classes
 * @param children - Title text
 * @param props - Additional HTML heading props
 */
const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

/**
 * Card Description Component
 * Subtitle or description text for the card
 * 
 * @param className - Additional CSS classes
 * @param children - Description text
 * @param props - Additional HTML paragraph props
 */
const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

/**
 * Card Content Component
 * Main content area of the card
 * 
 * @param className - Additional CSS classes
 * @param children - Card content
 * @param props - Additional HTML div props
 */
const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Card Footer Component
 * Footer area for actions or additional information
 * 
 * @param className - Additional CSS classes
 * @param children - Footer content
 * @param props - Additional HTML div props
 */
const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

/**
 * Specialized Dashboard Card Component
 * Pre-configured card for dashboard widgets with animations
 * 
 * @param title - Widget title
 * @param description - Widget description
 * @param icon - Widget icon
 * @param value - Main value to display
 * @param change - Change indicator (positive/negative)
 * @param children - Additional content
 * @param className - Additional CSS classes
 * @param props - Additional card props
 */
interface DashboardCardProps extends CardProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    value?: string | number;
    change?: {
        value: number;
        type: "increase" | "decrease";
    };
}

const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
    ({ title, description, icon, value, change, children, className, ...props }, ref) => (
        <Card
            ref={ref}
            variant="dashboard"
            className={cn("dashboard-widget animate-fade-in", className)}
            {...props}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    {title && (
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {title}
                        </CardTitle>
                    )}
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                </div>
                {icon && (
                    <div className="text-muted-foreground">
                        {icon}
                    </div>
                )}
            </CardHeader>

            <CardContent>
                {value && (
                    <div className="text-2xl font-bold">{value}</div>
                )}

                {change && (
                    <p className={cn(
                        "text-xs flex items-center gap-1 mt-1",
                        change.type === "increase" ? "text-green-600" : "text-red-600"
                    )}>
                        <span className={cn(
                            "inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-l-transparent border-r-transparent",
                            change.type === "increase"
                                ? "border-b-[6px] border-b-green-600"
                                : "border-t-[6px] border-t-red-600"
                        )} />
                        {Math.abs(change.value)}% from last month
                    </p>
                )}

                {children}
            </CardContent>
        </Card>
    )
);
DashboardCard.displayName = "DashboardCard";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    DashboardCard,
    cardVariants,
};