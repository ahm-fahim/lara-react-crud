import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UsersIndex({ users }) {
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
    });

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
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name || '',
            email: user.email || '',
            password: '', // Keep password blank unless changing
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}`);
        }
    };

    const cancelEdit = () => {
        setEditingUser(null);
        reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage system dashboard users, accounts, and credentials.</p>
            </div>

            {/* User Form Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span>{editingUser ? '✏️ Edit User Account' : '➕ Add New User'}</span>
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Password {editingUser && <span className="text-slate-400 font-normal">(leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
                        >
                            {editingUser ? 'Update User' : 'Save User'}
                        </button>
                        {editingUser && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">System Users Directory</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-600">
                        Total: {users ? users.length : 0}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5">ID</th>
                                <th className="px-6 py-3.5">Name</th>
                                <th className="px-6 py-3.5">Email</th>
                                <th className="px-6 py-3.5">Joined Date</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {!users || users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                                        No registered system users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{user.id}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleEdit(user)} className="text-cyan-600 hover:text-cyan-800 font-semibold text-xs cursor-pointer">Edit</button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

UsersIndex.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;