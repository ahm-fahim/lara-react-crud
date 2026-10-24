import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function ProductsIndex({ products = [] }) {
    // Dialog states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    // Search, Filter, Sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedFeatured, setSelectedFeatured] = useState('ALL');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

    // Create & Edit form
    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        name: '',
        slug: '',
        sku: '',
        description: '',
        price: '',
        sale_price: '',
        image: '',
        thumb: '',
        status: 'active',
        featured: false,
    });

    // Delete form
    const { delete: destroy, processing: deleteProcessing } = useForm();

    // Filtered & Sorted products
    const filteredProducts = useMemo(() => {
        return products
            .filter((prod) => {
                const query = searchQuery.toLowerCase().trim();
                const matchesQuery =
                    !query ||
                    prod.name?.toLowerCase().includes(query) ||
                    prod.sku?.toLowerCase().includes(query) ||
                    prod.slug?.toLowerCase().includes(query) ||
                    prod.description?.toLowerCase().includes(query) ||
                    String(prod.id).includes(query);

                const matchesStatus =
                    selectedStatus === 'ALL' || prod.status === selectedStatus;

                const matchesFeatured =
                    selectedFeatured === 'ALL' ||
                    (selectedFeatured === 'YES' ? prod.featured : !prod.featured);

                return matchesQuery && matchesStatus && matchesFeatured;
            })
            .sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];

                if (sortField === 'price' || sortField === 'sale_price') {
                    aVal = Number(aVal) || 0;
                    bVal = Number(bVal) || 0;
                } else if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = (bVal || '').toLowerCase();
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [products, searchQuery, selectedStatus, selectedFeatured, sortField, sortDirection]);

    // KPI Stats
    const stats = useMemo(() => {
        const total = products.length;
        const activeCount = products.filter((p) => p.status === 'active').length;
        const featuredCount = products.filter((p) => p.featured).length;
        const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
        return { total, activeCount, featuredCount, totalValue };
    }, [products]);

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
        setData({
            name: '',
            slug: '',
            sku: '',
            description: '',
            price: '',
            sale_price: '',
            image: '',
            thumb: '',
            status: 'active',
            featured: false,
        });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (product) => {
        clearErrors();
        setEditingProduct(product);
        setData({
            name: product.name || '',
            slug: product.slug || '',
            sku: product.sku || '',
            description: product.description || '',
            price: product.price || '',
            sale_price: product.sale_price || '',
            image: product.image || '',
            thumb: product.thumb || '',
            status: product.status || 'active',
            featured: Boolean(product.featured),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setEditingProduct(null);
                    reset();
                },
            });
        } else {
            post('/products', {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!deletingProduct) return;
        destroy(`/products/${deletingProduct.id}`, {
            onSuccess: () => {
                setDeletingProduct(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Product Catalog & Inventory
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage products, pricing, stock SKUs, promotional sales, and visibility.
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
                    <span>Add New Product</span>
                </button>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Items</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Items</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.activeCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured Items</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.featuredCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Value</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">
                            ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search products by title, SKU, or slug..."
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

                {/* Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Featured:</label>
                        <select
                            value={selectedFeatured}
                            onChange={(e) => setSelectedFeatured(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                        >
                            <option value="ALL">All Products</option>
                            <option value="YES">Featured Only</option>
                            <option value="NO">Standard Only</option>
                        </select>
                    </div>

                    {(searchQuery || selectedStatus !== 'ALL' || selectedFeatured !== 'ALL') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedStatus('ALL');
                                setSelectedFeatured('ALL');
                            }}
                            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Showing <span className="text-slate-900">{filteredProducts.length}</span> of {products.length} products
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
                                        <span>Product</span>
                                        {sortField === 'name' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('sku')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>SKU</span>
                                        {sortField === 'sku' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('price')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Price & Sale</span>
                                        {sortField === 'price' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('status')} className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <span>Status</span>
                                        {sortField === 'status' && (<span>{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center">Featured</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mb-3">
                                                📦
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-700">No products found</h4>
                                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                                No items match your filter criteria. Click "Add New Product" to list your first catalog item.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            #{prod.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3.5">
                                                {prod.image ? (
                                                    <img
                                                        src={prod.image}
                                                        alt={prod.name}
                                                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-cyan-400 font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                                                        📦
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-tight">{prod.name}</p>
                                                    <p className="text-xs text-slate-400 font-mono mt-0.5">/{prod.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200/60">
                                                {prod.sku || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-baseline gap-2">
                                                {prod.sale_price ? (
                                                    <>
                                                        <span className="font-bold text-emerald-600 font-mono">
                                                            ${Number(prod.sale_price).toFixed(2)}
                                                        </span>
                                                        <span className="text-xs line-through text-slate-400 font-mono">
                                                            ${Number(prod.price).toFixed(2)}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                                            Sale
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-slate-900 font-mono">
                                                        ${Number(prod.price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {prod.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span>Active</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                    <span>Inactive</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {prod.featured ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    ★ Featured
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(prod)}
                                                    title="Edit product"
                                                    className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeletingProduct(prod)}
                                                    title="Delete product"
                                                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal Dialog */}
            <Modal
                show={isCreateModalOpen || !!editingProduct}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingProduct(null);
                    reset();
                }}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                description={
                    editingProduct
                        ? `Update details and inventory for "${editingProduct.name}"`
                        : 'Fill in the product details below to add it to your catalog.'
                }
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Product Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                SKU Code <span className="text-slate-400 font-normal lowercase">(auto-generated if empty)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. PRD-894102"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all font-mono"
                            />
                            {errors.sku && <p className="text-red-500 text-xs mt-1 font-medium">{errors.sku}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Regular Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="99.99"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Sale Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="79.99 (Optional)"
                                value={data.sale_price}
                                onChange={(e) => setData('sale_price', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.sale_price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.sale_price}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Status *</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="active">Active (Visible)</option>
                                <option value="inactive">Inactive (Hidden)</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-xs mt-1 font-medium">{errors.status}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Image URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com/product.jpg"
                                value={data.image}
                                onChange={(e) => setData('image', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                            {errors.image && <p className="text-red-500 text-xs mt-1 font-medium">{errors.image}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Provide a detailed description of features and specifications..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.featured}
                                onChange={(e) => setData('featured', e.target.checked)}
                                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
                            />
                            <span className="text-xs font-bold text-slate-700">Mark as Featured Product (Highlight in store)</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setEditingProduct(null);
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
                            <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to permanently delete "${deletingProduct?.name}"? This action cannot be undone.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                isDanger={true}
                processing={deleteProcessing}
            />
        </div>
    );
}

ProductsIndex.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
