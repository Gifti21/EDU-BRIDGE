"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Users,
    Search,
    Filter,
    UserPlus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Calendar,
    MoreVertical,
    X,
    Eye,
    Download,
    Upload
} from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "STUDENT",
        phone: "",
        address: "",
        dateOfBirth: ""
    });

    useEffect(() => {
        // Simulate loading users
        setTimeout(() => {
            setUsers([
                { id: "1", name: "John Doe", email: "john@example.com", role: "STUDENT", status: "ACTIVE", createdAt: "2024-01-15", phone: "+251911234567", address: "Addis Ababa, Ethiopia", dateOfBirth: "2005-03-15" },
                { id: "2", name: "Jane Smith", email: "jane@example.com", role: "TEACHER", status: "ACTIVE", createdAt: "2024-01-10", phone: "+251922345678", address: "Addis Ababa, Ethiopia", dateOfBirth: "1985-07-22" },
                { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "PARENT", status: "PENDING", createdAt: "2024-02-01", phone: "+251933456789", address: "Addis Ababa, Ethiopia", dateOfBirth: "1980-11-10" },
                { id: "4", name: "Alice Williams", email: "alice@example.com", role: "STUDENT", status: "ACTIVE", createdAt: "2024-01-20", phone: "+251944567890", address: "Addis Ababa, Ethiopia", dateOfBirth: "2006-05-18" },
                { id: "5", name: "Charlie Brown", email: "charlie@example.com", role: "ADMIN", status: "ACTIVE", createdAt: "2024-01-05", phone: "+251955678901", address: "Addis Ababa, Ethiopia", dateOfBirth: "1975-09-30" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleApprove = () => {
        if (selectedUser) {
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: "ACTIVE" } : u));
            setShowApprovalModal(false);
            setSelectedUser(null);
        }
    };

    const handleReject = () => {
        if (selectedUser) {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setShowRejectModal(false);
            setSelectedUser(null);
        }
    };

    const handleEdit = () => {
        if (selectedUser) {
            setUsers(users.map(u => u.id === selectedUser.id ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth
            } : u));
            setShowEditModal(false);
            setSelectedUser(null);
            resetForm();
        }
    };

    const handleDelete = () => {
        if (selectedUser) {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setShowDeleteModal(false);
            setSelectedUser(null);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || "",
            address: user.address || "",
            dateOfBirth: user.dateOfBirth || ""
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const openViewModal = (user: User) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            role: "STUDENT",
            phone: "",
            address: "",
            dateOfBirth: ""
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-red-100 text-red-700 border-red-200";
            case "TEACHER": return "bg-blue-100 text-blue-700 border-blue-200";
            case "STUDENT": return "bg-green-100 text-green-700 border-green-200";
            case "PARENT": return "bg-purple-100 text-purple-700 border-purple-200";
            case "FINANCER": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "INACTIVE": return "bg-gray-100 text-gray-700 border-gray-200";
            case "SUSPENDED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Users className="h-8 w-8 mr-3 text-blue-600" />
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage all users in the system</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                            <Download className="h-5 w-5 mr-2" />
                            Export Users
                        </Button>
                        {users.filter(u => u.status === "PENDING").length > 0 && (
                            <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg animate-pulse">
                                <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
                                <span className="text-sm font-medium text-yellow-800">
                                    {users.filter(u => u.status === "PENDING").length} Pending Approval{users.filter(u => u.status === "PENDING").length > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="STUDENT">Student</option>
                            <option value="PARENT">Parent</option>
                            <option value="FINANCER">Financer</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="SUSPENDED">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === "ACTIVE").length}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === "PENDING").length}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Inactive</p>
                            <p className="text-2xl font-bold text-gray-600">{users.filter(u => u.status === "INACTIVE").length}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <XCircle className="h-6 w-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.phone && (
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => openViewModal(user)}
                                                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {user.status === "PENDING" ? (
                                                <>
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setShowApprovalModal(true); }}
                                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve User"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setShowRejectModal(true); }}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject User"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No users found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {showApprovalModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Approve User Registration</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to approve <span className="font-semibold">{selectedUser.name}</span> as a <span className="font-semibold">{selectedUser.role}</span>?
                            </p>
                            <div className="flex items-center space-x-3">
                                <Button onClick={() => setShowApprovalModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </Button>
                                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                    Approve
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Reject User Registration</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to reject <span className="font-semibold">{selectedUser.name}</span>'s registration? This action will remove their account.
                            </p>
                            <div className="flex items-center space-x-3">
                                <Button onClick={() => setShowRejectModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </Button>
                                <Button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Edit User</h2>
                                <button onClick={() => setShowEditModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="TEACHER">Teacher</option>
                                        <option value="PARENT">Parent</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="FINANCER">Financer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                            <Button onClick={() => setShowEditModal(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">User Details</h2>
                                <button onClick={() => setShowViewModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Role</p>
                                    <p className="font-medium text-gray-900">{selectedUser.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedUser.status)}`}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                                    <p className="font-medium text-gray-900">{selectedUser.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                                    <p className="font-medium text-gray-900">{selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Address</p>
                                    <p className="font-medium text-gray-900">{selectedUser.address || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Joined Date</p>
                                    <p className="font-medium text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                            <Button onClick={() => setShowViewModal(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                Close
                            </Button>
                            <Button onClick={() => { setShowViewModal(false); openEditModal(selectedUser); }} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                                Edit User
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold">{selectedUser.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex items-center space-x-3">
                                <Button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </Button>
                                <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
