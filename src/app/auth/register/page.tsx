"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Using simple HTML label instead of Radix UI for now
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";

// Registration schema
const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["STUDENT", "TEACHER", "PARENT", "ADMINISTRATOR"]),
  address: z.string().min(10, "Please provide a complete address"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const roleConfig = {
  STUDENT: {
    icon: GraduationCap,
    title: "Student Registration",
    description: "Join EduBridge as a student",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  TEACHER: {
    icon: BookOpen,
    title: "Teacher Registration",
    description: "Register as an educator",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  PARENT: {
    icon: Users,
    title: "Parent Registration",
    description: "Stay connected with your child",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  ADMINISTRATOR: {
    icon: Shield,
    title: "Administrator Registration",
    description: "Manage the school system",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  }
};

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<keyof typeof roleConfig | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema)
  });

  const watchedRole = watch("role");
  const currentRoleConfig = watchedRole ? roleConfig[watchedRole] : null;

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Store registration info in localStorage for status checking
        localStorage.setItem("registrationData", JSON.stringify({
          registrationId: result.data.registrationId,
          email: result.data.email
        }));

        setTimeout(() => {
          router.push("/auth/pending-approval");
        }, 2000);
      } else {
        console.error("Registration error:", result);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role as keyof typeof roleConfig);
    setValue("role", role as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Side - Background & Branding */}
      <div className="hidden lg:flex lg:w-2/5 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/pictures/students.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-indigo-900/80 to-purple-900/85"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-24 h-24 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-24 w-16 h-16 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-24 left-12 w-32 h-32 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-16 right-16 w-20 h-20 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/pictures/logo.jpg"
                alt="EduBridge Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">EduBridge</h1>
              <p className="text-blue-200">Educational Excellence Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Join Our Educational
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Community Today
              </span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create your account and become part of a comprehensive digital learning ecosystem designed for modern education.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="font-semibold text-white mb-2">🎓 Comprehensive Learning</h3>
            <p className="text-blue-200 text-sm">Access grades, assignments, and track your academic progress in real-time.</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="font-semibold text-white mb-2">💬 Seamless Communication</h3>
            <p className="text-blue-200 text-sm">Stay connected with teachers, parents, and administrators effortlessly.</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <h3 className="font-semibold text-white mb-2">🔒 Secure & Private</h3>
            <p className="text-blue-200 text-sm">Your data is protected with enterprise-grade security and FERPA compliance.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center">
          <p className="text-blue-200 text-sm">
            Trusted by 500+ schools worldwide • Secure & FERPA Compliant
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src="/pictures/logo.jpg"
                alt="EduBridge Logo"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <h1 className="text-3xl font-bold text-slate-900">EduBridge</h1>
            </div>
            <p className="text-slate-600">Create your account to get started</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-none">
            <CardHeader className="text-center pb-6">
              {currentRoleConfig && (
                <div className={`mx-auto w-16 h-16 ${currentRoleConfig.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <currentRoleConfig.icon className={`h-8 w-8 ${currentRoleConfig.color}`} />
                </div>
              )}
              <CardTitle className="text-2xl">
                {currentRoleConfig ? currentRoleConfig.title : "Choose Your Role"}
              </CardTitle>
              <CardDescription>
                {currentRoleConfig ? currentRoleConfig.description : "Select your role to continue"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Role Selection */}
                {!selectedRole && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {Object.entries(roleConfig).map(([role, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`p-8 rounded-xl border-2 border-slate-200 ${config.bgColor} hover:shadow-xl transition-all duration-300 text-left group hover:scale-105 hover:border-slate-300`}
                        >
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                              <IconComponent className={`h-8 w-8 ${config.color}`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">{role.charAt(0) + role.slice(1).toLowerCase()}</h3>
                              <p className="text-slate-600 leading-relaxed">{config.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Registration Form */}
                {selectedRole && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          placeholder="Enter your first name"
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          placeholder="Enter your last name"
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="Enter your email address"
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="Enter your phone number"
                          className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="address"
                          {...register("address")}
                          placeholder="Enter your complete address"
                          className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          placeholder="Create a strong password"
                          className={errors.password ? "border-red-500" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Status Messages */}
                    {submitStatus === "success" && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Registration successful! Redirecting to approval status page...
                        </AlertDescription>
                      </Alert>
                    )}

                    {submitStatus === "error" && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Registration failed. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex flex-col space-y-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Account...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("");
                          setValue("role", "" as any);
                        }}
                        className="text-slate-600 hover:text-slate-800 text-sm"
                      >
                        ← Change Role
                      </button>
                    </div>
                  </>
                )}
              </form>

              {/* Footer */}
              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Already have an account?</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-base transition-all duration-300">
                      Sign In to Your Account
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Footer */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex justify-center space-x-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
            </div>
            <p className="text-xs text-slate-500">
              © 2025 EduBridge Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}