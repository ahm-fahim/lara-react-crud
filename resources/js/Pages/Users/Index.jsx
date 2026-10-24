import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function UsersIndex({ users = [] }) {
    // Dialog state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

    // Create & Edit form
    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    // Delete form
    const { delete: destroy, processing: deleteProcessing } = useForm();

    // Filter & sort users
    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => {
                const query = searchQuery.toLowerCase().trim();
                return (
                    !query ||
                    user.name?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query) ||
                    String(user.id).includes(query)
                );
            })
            .sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = (bVal || '').toLowerCase();
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [users, searchQuery, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (user) => {
        clearErrors();
        setEditingUser(user);
        setData({
            name: user.name || '',
            email: user.email || '',
            password: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setEditingUser(null);
                    reset();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!deletingUser) return;
        destroy(`/users/${deletingUser.id}`, {
            onSuccess: () => {
                setDeletingUser(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        System Users Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Control administrative privileges, operator access, and account status.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-lg shadow-cyan-600/25 transition-all duration-200 cursor-pointer hover:shadow-cyan-600/35"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Add New User</span>
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Users</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{users.length}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Status</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-0.5">Protected & Active</p>
                    </div>
                </div>
            </div>

            {/* Search Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search users by name or email address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-slate-400"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="text-xs font-semibold text-slate-500">
                    Showing <span className="text-slate-900 font-bold">{filteredUsers.length}</span> accounts
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                <th onClick={() => handleSort('id')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>ID</span>
                                        {sortField === 'id' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('name')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>User Name</span>
                                        {sortField === 'name' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('email')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Email Address</span>
                                        {sortField === 'email' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('created_at')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Joined Date</span>
                                        {sortField === 'created_at' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mb-3">
                                                👥
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-700">No users found</h4>
                                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                                Try adjusting your search criteria or register a new user account.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                #{user.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                                                        {initial}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                                                        <span className="text-[10px] text-cyan-700 font-semibold uppercase tracking-wider bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100 mt-0.5 inline-block">
                                                            Active
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(user)}
                                                        title="Edit user"
                                                        className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingUser(user)}
                                                        title="Delete user"
                                                        className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create & Edit Modal Dialog */}
            <Modal
                show={isCreateModalOpen || !!editingUser}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingUser(null);
                    reset();
                }}
                title={editingUser ? 'Edit User Account' : 'Register New User'}
                description={
                    editingUser
                        ? `Update details and credentials for ${editingUser.name}`
                        : 'Create a new administrative user with dashboard access.'
                }
                maxWidth="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Password {editingUser && <span className="text-slate-400 font-normal lowercase">(leave blank to keep current)</span>}
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setEditingUser(null);
                                reset();
                            }}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-cyan-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            )}
                            <span>{editingUser ? 'Update User' : 'Save User'}</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={confirmDelete}
                title="Delete User Account"
                message={`Are you sure you want to permanently delete user "${deletingUser?.name}" (${deletingUser?.email})?`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                isDanger={true}
                processing={deleteProcessing}
            />
        </div>
    );
}

UsersIndex.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;