"use client";

/**
 * Dynamic Card Components for E-STUDENT PORTAL
 * Interactive cards with real-time data, animations, and hover effects
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
    TrendingUp,
    TrendingDown,
    Users,
    BookOpen,
    Calendar,
    DollarSign,
    Award,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Activity,
    Zap,
    Target
} from "lucide-react";

/**
 * Dynamic Stats Card with animated counters
 */
interface DynamicStatsCardProps {
    title: string;
    value: number;
    target: number;
    unit?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: React.ReactNode;
    color: string;
    description?: string;
}

export function DynamicStatsCard({
    title,
    value,
    target,
    unit = "",
    trend,
    icon,
    color,
    description
}: DynamicStatsCardProps) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Animate counter when card becomes visible
    useEffect(() => {
        if (isVisible) {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setAnimatedValue(target);
                    clearInterval(timer);
                } else {
                    setAnimatedValue(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isVisible, target]);

    // Intersection observer to trigger animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        const element = document.getElementById(`stats-card-${title.replace(/\s+/g, '-').toLowerCase()}`);
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, [title]);

    const percentage = (animatedValue / target) * 100;

    return (
        <Card
            id={`stats-card-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="group hover:scale-[1.02] transition-all duration-300 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
                <div className={`p-2 rounded-lg bg-white/10 ${color}`}>
                    {icon}
                </div>
            </CardHeader>

            <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                    {animatedValue.toLocaleString()}{unit}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                    <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                </div>

                {trend && (
                    <div className={cn(
                        "flex items-center text-xs",
                        trend.isPositive ? "text-green-300" : "text-red-300"
                    )}>
                        {trend.isPositive ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(trend.value)}% from last month
                    </div>
                )}

                {description && (
                    <p className="text-xs text-gray-300 mt-2">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Interactive Feature Card with hover effects
 */
interface InteractiveFeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
    stats: string;
    features: string[];
    onExplore?: () => void;
}

export function InteractiveFeatureCard({
    title,
    description,
    icon,
    gradient,
    stats,
    features,
    onExplore
}: InteractiveFeatureCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            className="group hover:scale-[1.02] transition-all duration-300 bg-white/25 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardHeader>
                <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <span className="text-xs bg-blue-100/20 text-white px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        {stats}
                    </span>
                </div>
                <CardTitle className="text-xl text-white mb-2">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <CardDescription className="text-base leading-relaxed text-gray-200 mb-4">
                    {description}
                </CardDescription>

                {/* Feature List - shows on hover */}
                <div className={cn(
                    "transition-all duration-300 overflow-hidden",
                    isHovered ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="space-y-2 mb-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={onExplore}
                    variant="ghost"
                    className="w-full text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                    Explore Feature
                    <Target className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
            </CardContent>
        </Card>
    );
}

/**
 * Live Activity Card showing real-time updates
 */
interface ActivityItem {
    id: string;
    type: 'grade' | 'attendance' | 'payment' | 'message';
    title: string;
    description: string;
    time: string;
    user: string;
    status: 'success' | 'warning' | 'info';
}

export function LiveActivityCard() {
    const [activities, setActivities] = useState<ActivityItem[]>([
        {
            id: '1',
            type: 'grade',
            title: 'New Grade Posted',
            description: 'Mathematics Quiz - Grade 10A',
            time: '2 min ago',
            user: 'Ms. Emily Davis',
            status: 'success'
        },
        {
            id: '2',
            type: 'attendance',
            title: 'Attendance Marked',
            description: 'Morning Session - Grade 9B',
            time: '5 min ago',
            user: 'Mr. Robert Wilson',
            status: 'info'
        },
        {
            id: '3',
            type: 'payment',
            title: 'Payment Received',
            description: 'Tuition Fee - Alice Smith',
            time: '10 min ago',
            user: 'Finance Department',
            status: 'success'
        },
        {
            id: '4',
            type: 'message',
            title: 'Parent Message',
            description: 'Inquiry about homework',
            time: '15 min ago',
            user: 'John Smith',
            status: 'warning'
        }
    ]);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setActivities(prev => {
                const newActivity: ActivityItem = {
                    id: Date.now().toString(),
                    type: ['grade', 'attendance', 'payment', 'message'][Math.floor(Math.random() * 4)] as any,
                    title: 'New Activity',
                    description: 'Live update simulation',
                    time: 'just now',
                    user: 'System',
                    status: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as any
                };

                return [newActivity, ...prev.slice(0, 3)];
            });
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'grade': return <BookOpen className="h-4 w-4" />;
            case 'attendance': return <Clock className="h-4 w-4" />;
            case 'payment': return <DollarSign className="h-4 w-4" />;
            case 'message': return <Activity className="h-4 w-4" />;
            default: return <Zap className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-400 bg-green-400/20';
            case 'warning': return 'text-yellow-400 bg-yellow-400/20';
            case 'info': return 'text-blue-400 bg-blue-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    return (
        <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">Live Activity</CardTitle>
                    <div className="flex items-center text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-xs">Live</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {activity.title}
                            </p>
                            <p className="text-xs text-gray-300 truncate">
                                {activity.description}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-400">{activity.user}</span>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

/**
 * Performance Metrics Card with animated charts
 */
export function PerformanceMetricsCard() {
    const [selectedMetric, setSelectedMetric] = useState('attendance');

    const metrics = {
        attendance: {
            title: 'Attendance Rate',
            value: 94.2,
            target: 95,
            color: 'text-green-400',
            bgColor: 'bg-green-400',
            data: [88, 91, 89, 94, 92, 94, 94.2]
        },
        grades: {
            title: 'Average Grade',
            value: 87.5,
            target: 90,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400',
            data: [82, 84, 86, 85, 87, 88, 87.5]
        },
        satisfaction: {
            title: 'Parent Satisfaction',
            value: 96.8,
            target: 95,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400',
            data: [92, 94, 95, 96, 97, 96, 96.8]
        }
    };

    const currentMetric = metrics[selectedMetric as keyof typeof metrics];

    return (
        <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-lg text-white">Performance Metrics</CardTitle>
                <div className="flex space-x-2">
                    {Object.entries(metrics).map(([key, metric]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedMetric(key)}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                                selectedMetric === key
                                    ? "bg-white/20 text-white"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {metric.title}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className={`text-3xl font-bold ${currentMetric.color}`}>
                            {currentMetric.value}%
                        </div>
                        <div className="text-xs text-gray-300">
                            Target: {currentMetric.target}%
                        </div>
                    </div>
                    <div className={cn(
                        "flex items-center text-xs",
                        currentMetric.value >= currentMetric.target ? "text-green-300" : "text-yellow-300"
                    )}>
                        {currentMetric.value >= currentMetric.target ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {currentMetric.value >= currentMetric.target ? "On Target" : "Below Target"}
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="h-20 flex items-end justify-between space-x-1">
                    {currentMetric.data.map((value, index) => (
                        <div
                            key={index}
                            className={`${currentMetric.bgColor}/60 rounded-t-sm transition-all duration-500 hover:${currentMetric.bgColor}`}
                            style={{
                                height: `${(value / 100) * 80}px`,
                                width: '12%',
                                animationDelay: `${index * 0.1}s`
                            }}
                        ></div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Quick Actions Card with interactive buttons
 */
export function QuickActionsCard() {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const actions = [
        {
            id: 'add-student',
            title: 'Add Student',
            description: 'Register new student',
            icon: <Users className="h-5 w-5" />,
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            id: 'create-assignment',
            title: 'Create Assignment',
            description: 'New homework task',
            icon: <BookOpen className="h-5 w-5" />,
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            id: 'schedule-event',
            title: 'Schedule Event',
            description: 'Add calendar event',
            icon: <Calendar className="h-5 w-5" />,
            color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
            id: 'generate-report',
            title: 'Generate Report',
            description: 'Create analytics report',
            icon: <BarChart3 className="h-5 w-5" />,
            color: 'bg-orange-500 hover:bg-orange-600'
        }
    ];

    return (
        <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">
                    Common tasks and shortcuts
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            variant="ghost"
                            className={cn(
                                "h-auto p-4 flex flex-col items-center text-center space-y-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300",
                                activeAction === action.id && "bg-white/20 border-white/40"
                            )}
                            onClick={() => setActiveAction(action.id)}
                        >
                            <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
                                {action.icon}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">{action.title}</div>
                                <div className="text-xs text-gray-300">{action.description}</div>
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Notification Card with real-time updates
 */
export function NotificationCard() {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            title: 'Grade Updated',
            message: 'Mathematics test results are now available',
            time: '2 min ago',
            type: 'success',
            unread: true
        },
        {
            id: '2',
            title: 'Parent Meeting',
            message: 'Scheduled for tomorrow at 3:00 PM',
            time: '1 hour ago',
            type: 'info',
            unread: true
        },
        {
            id: '3',
            title: 'Payment Due',
            message: 'Monthly fee payment due in 3 days',
            time: '2 hours ago',
            type: 'warning',
            unread: false
        }
    ]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
            case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
            case 'info': return <Activity className="h-4 w-4 text-blue-400" />;
            default: return <Zap className="h-4 w-4 text-gray-400" />;
        }
    };

    return (
        <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">Notifications</CardTitle>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-xs text-gray-300">
                            {notifications.filter(n => n.unread).length} new
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.map((notification, index) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/15",
                            notification.unread ? "bg-white/10" : "bg-white/5"
                        )}
                    >
                        <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white truncate">
                                    {notification.title}
                                </p>
                                {notification.unread && (
                                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                                )}
                            </div>
                            <p className="text-xs text-gray-300 truncate">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}