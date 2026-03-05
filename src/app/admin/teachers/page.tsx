"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    UserCheck,
    Search,
    Mail,
    Phone,
    BookOpen,
    Award,
    Download
} from "lucide-react";

interface Teacher {
    id: string;
    name: string;
    email: string;
    phone?: string;
    specialization?: string;
    coursesCount: number;
    status: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setTimeout(() => {
            setTeachers([
                { id: "1", name: "Jane Smith", email: "math.teacher@greenwood.edu", phone: "+251922345678", specialization: "Mathematics", coursesCount: 3, status: "ACTIVE" },
                { id: "2", name: "John Doe", email: "english.teacher@greenwood.edu", phone: "+251933456789", specialization: "English", coursesCount: 2, status: "ACTIVE" },
                { id: "3", name: "Alice Williams", email: "science.teacher@greenwood.edu", phone: "+251944567890", specialization: "Science", coursesCount: 4, status: "ACTIVE" },
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleExport = () => {
        const csvContent = [
            ["Name", "Email", "Phone", "Specialization", "Courses", "Status"],
            ...teachers.map(t => [
                t.name || "",
                t.email || "",
                t.phone || "",
                t.