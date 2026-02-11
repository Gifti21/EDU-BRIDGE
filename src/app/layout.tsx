/**
 * Root Layout for E-STUDENT PORTAL
 * Provides global styling, fonts, and metadata for the entire application
 */

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

/**
 * Inter font for body text - clean and readable
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Poppins font for headings - friendly and modern
 */
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/**
 * Application metadata for SEO and social sharing
 */
export const metadata: Metadata = {
  title: {
    default: "EduBridge",
    template: "%s | EduBridge",
  },
  description:
    "Comprehensive K-12 school management portal for students, teachers, parents, and administrators. " +
    "Manage academics, attendance, assignments, communication, and finances in one secure platform.",
  keywords: [
    "school management",
    "student portal",
    "education platform",
    "K-12 school",
    "academic management",
    "parent portal",
    "teacher dashboard",
  ],
  authors: [{ name: "EduBridge Team" }],
  creator: "EduBridge",
  publisher: "EduBridge",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edubridge.com",
    title: "EduBridge - Complete School Management System",
    description:
      "Bridge communication gaps in K-12 education with our comprehensive platform for students, teachers, parents, and administrators.",
    siteName: "EduBridge",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduBridge - Complete School Management System",
    description:
      "Bridge communication gaps in K-12 education with our comprehensive platform for students, teachers, parents, and administrators.",
    creator: "@edubridge",
  },

};

/**
 * Viewport configuration
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

/**
 * Root Layout Component
 * Wraps the entire application with global providers and styling
 * 
 * Features:
 * - Custom font loading (Inter + Poppins)
 * - Global CSS variables and styling
 * - Responsive design support
 * - Dark mode support
 * - Accessibility optimizations
 * 
 * @param children - Page content to render
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />

        {/* Preload critical fonts for better performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          as="style"
        />
      </head>
      <body
        className={`
          ${inter.variable} 
          ${poppins.variable} 
          font-sans 
          antialiased 
          min-h-screen 
          bg-background 
          text-foreground
        `}
        suppressHydrationWarning
      >
        {/* Main application content */}
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>

        {/* Accessibility improvements */}
        <div id="portal-root" />

        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 
                     focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}