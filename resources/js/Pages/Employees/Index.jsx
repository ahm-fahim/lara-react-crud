import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ employees }) {
    const [editingEmployee, setEditingEmployee] = useState(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        designation: '',
        salary: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEmployee) {
            put(`/employees/${editingEmployee.id}`, {
                onSuccess: () => {
                    setEditingEmployee(null);
                    reset();
                },
            });
        } else {
            post('/employees', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setData({
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            email: employee.email || '',
            phone: employee.phone || '',
            designation: employee.designation || '',
            salary: employee.salary || '',
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(`/employees/${id}`);
        }
    };

    const cancelEdit = () => {
        setEditingEmployee(null);
        reset();
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Management</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage organization personnel records, titles, and compensation.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span>{editingEmployee ? '✏️ Edit Employee Profile' : '➕ Add New Employee'}</span>
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.first_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.first_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Last Name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.last_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Phone Number</label>
                            <input
                                type="text"
                                placeholder="+1 (555) 000-0000"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Designation</label>
                            <input
                                type="text"
                                placeholder="Software Engineer"
                                value={data.designation}
                                onChange={(e) => setData('designation', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.designation && <p className="text-red-500 text-xs mt-1 font-medium">{errors.designation}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Salary ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="75000"
                                value={data.salary}
                                onChange={(e) => setData('salary', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            {errors.salary && <p className="text-red-500 text-xs mt-1 font-medium">{errors.salary}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
                        >
                            {editingEmployee ? 'Update Employee' : 'Save Employee'}
                        </button>
                        {editingEmployee && (
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

            {/* Employee Table Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Employee Directory</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-600">
                        Total: {employees ? employees.length : 0}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5">ID</th>
                                <th className="px-6 py-3.5">Full Name</th>
                                <th className="px-6 py-3.5">Email</th>
                                <th className="px-6 py-3.5">Phone</th>
                                <th className="px-6 py-3.5">Designation</th>
                                <th className="px-6 py-3.5">Salary</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {!employees || employees.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-slate-400 font-medium">
                                        No employee records found.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{emp.id}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{emp.first_name} {emp.last_name}</td>
                                        <td className="px-6 py-4 text-slate-500">{emp.email}</td>
                                        <td className="px-6 py-4 text-slate-500">{emp.phone || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100">
                                                {emp.designation}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">${Number(emp.salary).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleEdit(emp)} className="text-cyan-600 hover:text-cyan-800 font-semibold text-xs cursor-pointer">Edit</button>
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer">Delete</button>
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

Index.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;