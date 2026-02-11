"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  CreditCard,
  BarChart3,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Typewriter Animation Component
 */
function TypewriterText({ text, delay = 0, speed = 100 }: { text: string; delay?: number; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isStarted]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/**
 * Main HomePage Component
 */
export default function HomePage() {
  // Add CSS animations
  const styles = `
    @keyframes slowZoom {
      0% { transform: scale(1) translateX(0px) translateY(0px); }
      50% { transform: scale(1.05) translateX(-10px) translateY(-5px); }
      100% { transform: scale(1.02) translateX(5px) translateY(-10px); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      25% { transform: translateY(-10px) translateX(5px) scale(1.01); }
      50% { transform: translateY(-5px) translateX(-8px) scale(1.02); }
      75% { transform: translateY(-15px) translateX(3px) scale(1.01); }
    }
    
    @keyframes backgroundFloat {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      33% { transform: translateY(-20px) translateX(15px) scale(1.03); }
      66% { transform: translateY(10px) translateX(-10px) scale(1.01); }
    }
    
    @keyframes gentleZoom {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    
    .animate-background-float {
      animation: backgroundFloat 25s ease-in-out infinite;
    }
    
    .animate-gentle-zoom {
      animation: gentleZoom 18s ease-in-out infinite;
    }
  `;

  const features = [
    {
      icon: <Users className="h-10 w-10" />,
      title: "User Management",
      description: "Complete user management system for all stakeholders",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Academic Records",
      description: "Digital grade management and academic tracking",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Attendance Tracking",
      description: "Automated attendance monitoring and reporting",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <MessageSquare className="h-10 w-10" />,
      title: "Communication Hub",
      description: "Seamless communication between all users",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: "Fee Management",
      description: "Secure online payment processing system",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "Analytics & Reports",
      description: "Comprehensive analytics and reporting tools",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{styles}</style>
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-sky-300 to-blue-400 border-b border-sky-200 shadow-lg">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/pictures/logo.jpg"
                alt="EduBridge Logo"
                width={100}
                height={100}
                className="rounded-lg"
              />
              <span className="text-3xl font-bold text-black">EduBridge</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-slate-800 hover:text-slate-900 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                Features
              </Link>
              <Link href="#about" className="text-slate-800 hover:text-slate-900 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                About
              </Link>
              <Link href="#pricing" className="text-slate-800 hover:text-slate-900 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                Pricing
              </Link>
              <Link href="#contact" className="text-slate-800 hover:text-slate-900 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-800 hover:text-slate-900 hover:bg-white/30 font-semibold backdrop-blur-sm border border-white/20">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-slate-800 hover:bg-slate-900 text-white shadow-xl font-semibold border border-slate-700 hover:border-slate-600 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Beautiful School Background with Animation */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
            style={{
              backgroundImage: "url('/pictures/website background.jpg')",
              backgroundSize: "100%",
              animation: "slowZoom 20s ease-in-out infinite alternate, float 15s ease-in-out infinite"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-indigo-900/60"></div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animation: "float 8s ease-in-out infinite, pulse 3s ease-in-out infinite" }}></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mifrom-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-black/10 rounded-3xl p-8 mx-auto max-w-5xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg mb-8">
                <span className="bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  <TypewriterText text="EduBridge" delay={300} speed={100} />
                </span>
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                <TypewriterText text="Bridge Communication Gaps in K-12 Education" delay={2000} speed={60} />
              </h2>
              <p className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto mb-8 leading-relaxed">
                Eliminate fragmented communication, ensure academic transparency, and replace manual processes with our comprehensive digital ecosystem for students, teachers, parents, and administrators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 mt-12">
              <Link href="/auth/register">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-700 hover:border-slate-600">
                  Start Your Digital Transformation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="border-white/70 text-white hover:bg-white/25 hover:text-slate-900 px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-md border-2 hover:border-white transition-all duration-300">
                  See Live Demo
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              <TypewriterText text="Everything You Need in One Platform" delay={600} speed={60} />
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive school management features designed for modern educational institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                    <div className={`${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              <TypewriterText text="Built for Every Education Stakeholder" delay={1000} speed={65} />
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how EduBridge transforms the experience for each member of your school community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Students */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-float group-hover:animate-gentle-zoom transition-transform duration-700"
                style={{ backgroundImage: "url('/pictures/students.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 group-hover:from-blue-800/60 group-hover:to-cyan-800/60 transition-all duration-500"></div>
              </div>
              <div className="relative p-8 h-80 flex flex-col justify-end">
                <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/40 group-hover:bg-white/70 group-hover:border-white/60 group-hover:shadow-lg transition-all duration-500 transform group-hover:scale-105">
                  <h3 className="text-2xl font-bold text-blue mb-4 flex items-center">
                    <Users className="h-8 w-8 mr-3 text-blue-300" />
                    Students
                  </h3>
                  <ul className="space-y-2 text-purple/90">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-300 rounded-full mr-3"></span>
                      Access grades and assignments instantly
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-300 rounded-full mr-3"></span>
                      Download course materials anytime
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-300 rounded-full mr-3"></span>
                      Track attendance and academic progress
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-300 rounded-full mr-3"></span>
                      Submit assignments digitally
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Teachers */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-float group-hover:animate-gentle-zoom transition-transform duration-700"
                style={{
                  backgroundImage: "url('/pictures/teachers.jpg')",
                  animationDelay: "5s"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 to-emerald-900/50 group-hover:from-green-800/60 group-hover:to-emerald-800/60 transition-all duration-500"></div>
              </div>
              <div className="relative p-8 h-80 flex flex-col justify-end">
                <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/40">
                  <h3 className="text-2xl font-bold text-blue mb-4 flex items-center">
                    <BookOpen className="h-8 w-8 mr-3 text-green-300" />
                    Teachers
                  </h3>
                  <ul className="space-y-2 text-purple/90">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-300 rounded-full mr-3"></span>
                      Update grades and attendance in real-time
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-300 rounded-full mr-3"></span>
                      Communicate directly with parents
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-300 rounded-full mr-3"></span>
                      Manage assignments and course materials
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-300 rounded-full mr-3"></span>
                      Generate academic reports instantly
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Parents */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl group">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-float group-hover:animate-gentle-zoom"
                style={{
                  backgroundImage: "url('/pictures/parents background image.jpg')",
                  animationDelay: "10s"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50"></div>
              </div>
              <div className="relative p-8 h-80 flex flex-col justify-end">
                <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/40">
                  <h3 className="text-2xl font-bold text-blue mb-4 flex items-center">
                    <MessageSquare className="h-8 w-8 mr-3 text-purple-300" />
                    Parents
                  </h3>
                  <ul className="space-y-2 text-purple/90">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-300 rounded-full mr-3"></span>
                      Monitor child's academic progress live
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-300 rounded-full mr-3"></span>
                      Receive instant attendance notifications
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-300 rounded-full mr-3"></span>
                      Pay school fees securely online
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-300 rounded-full mr-3"></span>
                      Direct communication with teachers
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Administrators/Directors */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl group">
              {/* Fallback background image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-float group-hover:animate-gentle-zoom"
                style={{
                  backgroundImage: "url('/pictures/admin backgound image.jpg')",
                  animationDelay: "15s"
                }}
              ></div>

              {/* Video overlay (if available) */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover animate-background-float group-hover:animate-gentle-zoom opacity-30"
                style={{ animationDelay: "15s" }}
              >
                <source src="/videos/admin-management.mp4" type="video/mp4" />
                <source src="/videos/admin-management.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 to-red-900/50"></div>
              <div className="relative p-8 h-80 flex flex-col justify-end">
                <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/40">
                  <h3 className="text-2xl font-bold text-blue mb-4 flex items-center">
                    <BarChart3 className="h-8 w-8 mr-3 text-orange-300" />
                    Administrators
                  </h3>
                  <ul className="space-y-2 text-purple/90">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                      Manage all user accounts and permissions
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                      Generate comprehensive school reports
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                      Oversee financial transactions and billing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                      Create courses and manage schedules
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-gentle-zoom"
          style={{
            backgroundImage: "url('/pictures/hover.jpg')",
            backgroundSize: "100"
          }}
        ></div>

        {/* Video Background Overlay (if available) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover animate-gentle-zoom opacity-35"
        >
          <source src="/videos/school-transformation.mp4" type="video/mp4" />
          <source src="/videos/school-transformation.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-indigo-900/60"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            <TypewriterText text="Ready to Transform Your School?" delay={1500} speed={70} />
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of schools worldwide that trust EduBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300">
                Start Free Trial
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/70 text-white hover:bg-white/25 hover:text-slate-900 px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-md border-2 hover:border-white transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Image
                  src="/pictures/logo.jpg"
                  alt="EduBridge Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-2xl font-bold">EduBridge</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Bridging communication gaps in K-12 education through innovative technology and seamless digital experiences.
              </p>
              <div className="flex space-x-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Trusted Platform</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Secure</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li><Link href="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/security" className="text-gray-300 hover:text-white transition-colors">Security</Link></li>
                  <li><Link href="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
                </ul>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📧</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:medhanitmedi344@gmail.com" className="text-white hover:text-blue-400 transition-colors">
                      medhanitmedi344@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <a href="tel:+251938675525" className="text-white hover:text-green-400 transition-colors">
                      +251 938 675 525
                    </a>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/help" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block">
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 EduBridge Technologies. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}