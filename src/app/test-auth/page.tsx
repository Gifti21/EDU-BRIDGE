"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuthPage() {
    const [results, setResults] = useState<string[]>([]);

    const addResult = (message: string) => {
        setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testLogin = async (email: string, password: string, role: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                addResult(`✅ ${role} login successful: ${data.user.email}`);
                return true;
            } else {
                addResult(`❌ ${role} login failed: ${data.error}`);
                return false;
            }
        } catch (error) {
            addResult(`❌ ${role} login error: ${error}`);
            return false;
        }
    };

    const testRouteAccess = async (route: string) => {
        try {
            const response = await fetch(route);

            if (response.redirected) {
                addResult(`🔄 ${route} - Redirected to: ${response.url}`);
            } else if (response.ok) {
                addResult(`✅ ${route} - Access granted (${response.status})`);
            } else {
                addResult(`❌ ${route} - Access denied (${response.status})`);
            }
        } catch (error) {
            addResult(`❌ ${route} - Error: ${error}`);
        }
    };

    const testLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                addResult(`✅ Logout successful`);
            } else {
                addResult(`❌ Logout failed`);
            }
        } catch (error) {
            addResult(`❌ Logout error: ${error}`);
        }
    };

    const runFullTest = async () => {
        setResults([]);
        addResult("🚀 Starting middleware tests...");

        // Test 1: Unauthenticated access
        addResult("\n📋 Test 1: Unauthenticated Access");
        await testRouteAccess('/admin/dashboard');
        await testRouteAccess('/student/dashboard');

        // Test 2: Admin login and access
        addResult("\n📋 Test 2: Admin Login and Access");
        const adminLoggedIn = await testLogin('medhanitmedi344@gmail.com', 'Medhanit_21', 'Admin');
        if (adminLoggedIn) {
            await testRouteAccess('/admin/dashboard');
            await testRouteAccess('/student/dashboard'); // Should redirect
        }
        await testLogout();

        // Test 3: Student login and access
        addResult("\n📋 Test 3: Student Login and Access");
        const studentLoggedIn = await testLogin('alice.smith@student.greenwood.edu', 'student123', 'Student');
        if (studentLoggedIn) {
            await testRouteAccess('/student/dashboard');
            await testRouteAccess('/admin/dashboard'); // Should redirect
        }
        await testLogout();

        // Test 4: Teacher login and access
        addResult("\n📋 Test 4: Teacher Login and Access");
        const teacherLoggedIn = await testLogin('math.teacher@greenwood.edu', 'teacher123', 'Teacher');
        if (teacherLoggedIn) {
            await testRouteAccess('/teacher/dashboard');
            await testRouteAccess('/admin/dashboard'); // Should redirect
        }
        await testLogout();

        addResult("\n✅ All tests completed!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>🧪 Middleware & Authentication Testing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4 flex-wrap">
                                <Button onClick={runFullTest}>
                                    Run Full Test Suite
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => testLogin('medhanitmedi344@gmail.com', 'Medhanit_21', 'Admin')}
                                >
                                    Test Admin Login
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => testLogin('alice.smith@student.greenwood.edu', 'student123', 'Student')}
                                >
                                    Test Student Login
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={testLogout}
                                >
                                    Test Logout
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setResults([])}
                                >
                                    Clear Results
                                </Button>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold mb-2">Test Results:</h3>
                                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                                    {results.length === 0 ? (
                                        <div className="text-gray-500">No tests run yet. Click "Run Full Test Suite" to start.</div>
                                    ) : (
                                        results.map((result, index) => (
                                            <div key={index} className="mb-1">
                                                {result}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold mb-2">📝 Test Credentials:</h4>
                                <ul className="text-sm space-y-1">
                                    <li><strong>Admin:</strong> medhanitmedi344@gmail.com / Medhanit_21</li>
                                    <li><strong>Teacher:</strong> math.teacher@greenwood.edu / teacher123</li>
                                    <li><strong>Student:</strong> alice.smith@student.greenwood.edu / student123</li>
                                    <li><strong>Parent:</strong> john.smith@email.com / parent123</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
