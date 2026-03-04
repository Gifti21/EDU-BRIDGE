"use client";

import { useEffect, useState } from "react";
import { UserCheck, UserX, Clock, Mail, Phone, MapPin, User } from "lucide-react";

interface Registration {
    id: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    role: string;
    status: string;
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
}

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("PENDING");
    const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [processing, setProcessing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchRegistrations();
    }, [filter]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/registrations?status=${filter}`);
            const data = await response.json();
            if (data.success) {
                setRegistrations(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch registrations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (regId: string) => {
        if (!confirm("Are you sure you want to approve this registration?")) return;

        setProcessing(true);
        try {
            const response = await fetch(`/api/admin/registrations/${regId}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminId: "temp-admin-id" })
            });

            const data = await response.json();
            if (data.success) {
                alert("Registration approved successfully!");
                fetchRegistrations();
            } else {
                alert(data.error || "Failed to approve registration");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) {
            alert("Please select registrations to approve");
            return;
        }

        if (!confirm(`Are you sure you want to approve ${selectedIds.length} registrations?`)) return;

        setProcessing(true);
        try {
            const response = await fetch("/api/admin/registrations/bulk-approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationIds: selectedIds,
                    adminId: "temp-admin-id"
                })
            });

            const data = await response.json();
            if (data.success) {
                alert(`Successfully approved ${data.count} registrations!`);
                setSelectedIds([]);
                fetchRegistrations();
            } else {
                alert(data.error || "Failed to approve registrations");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setProcessing(false);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === registrations.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(registrations.map(r => r.id));
        }
    };

    const handleReject = async (regId: string) => {
        if (!rejectionReason || rejectionReason.trim().length < 10) {
            alert("Please provide a rejection reason (at least 10 characters)");
            return;
        }

        setProcessing(true);
        try {
            const response = await fetch(`/api/admin/registrations/${regId}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminId: "temp-admin-id",
                    reason: rejectionReason
                })
            });

            const data = await response.json();
            if (data.success) {
                alert("Registration rejected");
                setSelectedReg(null);
                setRejectionReason("");
                fetchRegistrations();
            } else {
                alert(data.error || "Failed to reject registration");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setProcessing(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            STUDENT: "bg-blue-100 text-blue-800",
            PARENT: "bg-green-100 text-green-800",
            TEACHER: "bg-purple-100 text-purple-800",
            ADMINISTRATOR: "bg-red-100 text-red-800",
            FINANCER: "bg-yellow-100 text-yellow-800"
        };
        return colors[role] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Registration Requests</h1>
                    <p className="text-gray-600">Review and manage pending user registrations</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-6 py-3 font-medium transition-colors ${filter === status
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Actions */}
                {filter === "PENDING" && registrations.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === registrations.length}
                                    onChange={toggleSelectAll}
                                    className="w-5 h-5 rounded border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Select All ({registrations.length})
                                </span>
                            </label>
                            {selectedIds.length > 0 && (
                                <span className="text-sm text-gray-600">
                                    {selectedIds.length} selected
                                </span>
                            )}
                        </div>
                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleBulkApprove}
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                <UserCheck className="w-4 h-4" />
                                Approve Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>
                )}

                {/* Registrations List */}
                {loading ? (
                    <div className="text-center py-12">
                        <Clock className="w-12 h-12 animate-spin mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Loading registrations...</p>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600 text-lg">No {filter.toLowerCase()} registrations</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {registrations.map((reg) => (
                            <div key={reg.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-start gap-4">
                                    {filter === "PENDING" && (
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(reg.id)}
                                            onChange={() => toggleSelection(reg.id)}
                                            className="w-5 h-5 mt-1 rounded border-gray-300"
                                        />
                                    )}
                                    <div className="flex items-start justify-between flex-1">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {reg.firstName} {reg.lastName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(reg.role)}`}>
                                                    {reg.role}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {reg.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {reg.phone}
                                                </div>
                                                <div className="flex items-center gap-2 md:col-span-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {reg.address}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Submitted: {new Date(reg.submittedAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {reg.rejectionReason && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                                    <p className="text-sm text-red-800">
                                                        <strong>Rejection Reason:</strong> {reg.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {filter === "PENDING" && (
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleApprove(reg.id)}
                                                    disabled={processing}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setSelectedReg(reg)}
                                                    disabled={processing}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            {selectedReg && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Reject Registration</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting {selectedReg.firstName} {selectedReg.lastName}'s registration:
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-4 min-h-[120px]"
                            placeholder="Enter rejection reason (minimum 10 characters)..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleReject(selectedReg.id)}
                                disabled={processing || rejectionReason.trim().length < 10}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                Confirm Rejection
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedReg(null);
                                    setRejectionReason("");
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
