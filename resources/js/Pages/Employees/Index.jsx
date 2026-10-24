import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function EmployeesIndex({ employees = [] }) {
    // Dialog state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deletingEmployee, setDeletingEmployee] = useState(null);

    // Filter & Search & Sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('ALL');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

    // Create & Edit form
    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        designation: '',
        salary: '',
    });

    // Delete form
    const { delete: destroy, processing: deleteProcessing } = useForm();

    // Unique designations for filter dropdown
    const uniqueDesignations = useMemo(() => {
        const set = new Set();
        employees.forEach((emp) => {
            if (emp.designation) set.add(emp.designation);
        });
        return Array.from(set).sort();
    }, [employees]);

    // Filtered & Sorted employees
    const filteredEmployees = useMemo(() => {
        return employees
            .filter((emp) => {
                const query = searchQuery.toLowerCase().trim();
                const matchesQuery =
                    !query ||
                    emp.first_name?.toLowerCase().includes(query) ||
                    emp.last_name?.toLowerCase().includes(query) ||
                    emp.email?.toLowerCase().includes(query) ||
                    emp.phone?.toLowerCase().includes(query) ||
                    emp.designation?.toLowerCase().includes(query) ||
                    String(emp.id).includes(query);

                const matchesDesignation =
                    selectedDesignation === 'ALL' || emp.designation === selectedDesignation;

                return matchesQuery && matchesDesignation;
            })
            .sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];

                if (sortField === 'salary') {
                    aVal = Number(aVal) || 0;
                    bVal = Number(bVal) || 0;
                } else if (sortField === 'name') {
                    aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
                    bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
                } else if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = (bVal || '').toLowerCase();
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [employees, searchQuery, selectedDesignation, sortField, sortDirection]);

    // KPI stats calculations
    const stats = useMemo(() => {
        const total = employees.length;
        const totalSalary = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
        const avgSalary = total > 0 ? Math.round(totalSalary / total) : 0;
        return { total, avgSalary, designationsCount: uniqueDesignations.length };
    }, [employees, uniqueDesignations]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Open create modal
    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    // Open edit modal
    const openEditModal = (employee) => {
        clearErrors();
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

    // Submit handler
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
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    // Delete handler
    const confirmDelete = () => {
        if (!deletingEmployee) return;
        destroy(`/employees/${deletingEmployee.id}`, {
            onSuccess: () => {
                setDeletingEmployee(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Employee Directory
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor team members, designations, payroll, and contact profiles.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-lg shadow-cyan-600/25 transition-all duration-200 cursor-pointer hover:shadow-cyan-600/35"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add New Employee</span>
                </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Staff</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Designations</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.designationsCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Compensation</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">${stats.avgSalary.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Field */}
                <div className="relative flex-1 max-w-md">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, email, phone, or title..."
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

                {/* Dropdown Filters & Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Designation Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Designation:</label>
                        <select
                            value={selectedDesignation}
                            onChange={(e) => setSelectedDesignation(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                        >
                            <option value="ALL">All Roles ({employees.length})</option>
                            {uniqueDesignations.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(searchQuery || selectedDesignation !== 'ALL') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedDesignation('ALL');
                            }}
                            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Showing <span className="text-slate-900">{filteredEmployees.length}</span> of {employees.length} records
                    </p>
                    <span className="text-[11px] text-slate-400">Click column header to sort</span>
                </div>

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
                                        <span>Full Name</span>
                                        {sortField === 'name' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('email')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Contact</span>
                                        {sortField === 'email' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('designation')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Role / Designation</span>
                                        {sortField === 'designation' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('salary')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Annual Salary</span>
                                        {sortField === 'salary' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mb-3">
                                                🔍
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-700">No matching employees found</h4>
                                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                                Try adjusting your search query or reset the designation filters to find what you are looking for.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => {
                                    const initial = emp.first_name ? emp.first_name.charAt(0).toUpperCase() : 'E';
                                    return (
                                        <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                #{emp.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                                                        {initial}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-tight">
                                                            {emp.first_name} {emp.last_name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                                            ID: EMP-{String(emp.id).padStart(4, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-800 font-medium">{emp.email}</p>
                                                <p className="text-xs text-slate-400">{emp.phone || 'No phone'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100/80">
                                                    {emp.designation}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-slate-900">
                                                    ${Number(emp.salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(emp)}
                                                        title="Edit employee"
                                                        className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingEmployee(emp)}
                                                        title="Delete employee"
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

            {/* Create / Edit Employee Modal Dialog */}
            <Modal
                show={isCreateModalOpen || !!editingEmployee}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingEmployee(null);
                    reset();
                }}
                title={editingEmployee ? 'Edit Employee Information' : 'Add New Employee'}
                description={
                    editingEmployee
                        ? `Update details and payroll for ${editingEmployee.first_name} ${editingEmployee.last_name}`
                        : 'Fill in the information below to register a new employee.'
                }
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">First Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. John"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.first_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.first_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Last Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Doe"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.last_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address *</label>
                            <input
                                type="email"
                                placeholder="john.doe@company.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Phone Number</label>
                            <input
                                type="text"
                                placeholder="+1 (555) 000-0000"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Role / Designation *</label>
                            <input
                                type="text"
                                placeholder="e.g. Software Engineer"
                                value={data.designation}
                                onChange={(e) => setData('designation', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.designation && <p className="text-red-500 text-xs mt-1 font-medium">{errors.designation}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Annual Salary ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="75000"
                                value={data.salary}
                                onChange={(e) => setData('salary', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.salary && <p className="text-red-500 text-xs mt-1 font-medium">{errors.salary}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setEditingEmployee(null);
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
                            <span>{editingEmployee ? 'Update Employee' : 'Save Employee'}</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={!!deletingEmployee}
                onClose={() => setDeletingEmployee(null)}
                onConfirm={confirmDelete}
                title="Delete Employee Record"
                message={`Are you sure you want to delete ${deletingEmployee?.first_name} ${deletingEmployee?.last_name}? All associated records will be permanently removed.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                isDanger={true}
                processing={deleteProcessing}
            />
        </div>
    );
}

EmployeesIndex.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;