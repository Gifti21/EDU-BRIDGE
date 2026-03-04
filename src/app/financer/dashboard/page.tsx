"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Download,
    FileText,
    BarChart3,
    CreditCard
} from "lucide-react";

export default function FinancerDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchDashboar