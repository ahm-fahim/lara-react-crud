import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebar_collapsed') === 'true';
        }
        return false;
    });

    const { url, props } = usePage();
    const user = props.auth?.user;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar_collapsed', collapsed ? 'true' : 'false');
        }
    }, [collapsed]);

    const navItems = [
        {
            name: 'Products',
            href: '/products',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            name: 'Employees',
            href: '/employees',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            name: 'System Users',
            href: '/users',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
    ];

    const isActive = (path) => url.startsWith(path);

    const handleLogout = () => {
        router.post('/logout');
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

    return (
        <div className="min-h-screen bg-slate-50/70 font-sans flex text-slate-900 selection:bg-cyan-500 selection:text-white">
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-300 z-50 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out shadow-2xl ${
                    collapsed ? 'w-20' : 'w-64'
                } ${
                    mobileOpen ? 'translate-x-0 !w-64' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Brand Header */}
                <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/30">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-white font-black flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
                            ⚡
                        </div>
                        {(!collapsed || mobileOpen) && (
                            <div className="truncate">
                                <span className="font-bold text-white tracking-wide text-sm block leading-tight">
                                    LaraReact <span className="text-cyan-400">Pro</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                                    Management Console
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Mobile close button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Nav list */}
                <div className="px-3 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {(!collapsed || mobileOpen) ? 'Navigation' : '•••'}
                </div>
                <nav className="flex-1 px-3 space-y-1.5">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? item.name : undefined}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                                    active
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                                }`}
                            >
                                <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                                    {item.icon}
                                </span>
                                {(!collapsed || mobileOpen) && (
                                    <span className="truncate">{item.name}</span>
                                )}

                                {/* Collapsed Tooltip */}
                                {collapsed && !mobileOpen && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-950 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-800">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse / Expand Toggle Button (Desktop) */}
                <div className="hidden lg:block p-3 border-t border-slate-800/60">
                    <button
                        type="button"
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        {!collapsed && <span>Collapse Sidebar</span>}
                    </button>
                </div>

                {/* User footer */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/10 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
                                {userInitial}
                            </div>
                            {(!collapsed || mobileOpen) && (
                                <div className="text-xs truncate">
                                    <p className="font-semibold text-white truncate leading-tight">
                                        {user?.name || 'Administrator'}
                                    </p>
                                    <p className="text-slate-400 text-[11px] truncate">
                                        {user?.email || 'admin@admin.com'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {(!collapsed || mobileOpen) && (
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                    collapsed ? 'lg:pl-20' : 'lg:pl-64'
                }`}
            >
                {/* Top Nav */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Open menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </button>

                        <div className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-2">
                            <span>Workspace</span>
                            <span>/</span>
                            <span className="text-slate-900 font-bold capitalize">
                                {url.replace('/', '') || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Live Database Connected</span>
                        </div>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                {userInitial}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 hidden md:block">
                                {user?.name || 'Admin'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}