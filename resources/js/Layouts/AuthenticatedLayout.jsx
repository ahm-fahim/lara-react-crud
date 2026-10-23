import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url, props } = usePage();

    // Get authenticated user dynamically from Inertia shared props
    const user = props.auth?.user;

    const navItems = [
        { name: 'Users', href: '/users', icon: '👥' },
        { name: 'Employees', href: '/employees', icon: '💼' },
    ];

    const isActive = (path) => url.startsWith(path);

    const handleLogout = () => {
        router.post('/logout');
    };

    // Extract first letter of name for avatar badge
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                        LaraReact ERP
                    </span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    active
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Dynamic Sidebar Footer with SVG Logout Icon */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 shrink-0 rounded-full bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/20">
                            {userInitial}
                        </div>
                        <div className="text-xs truncate">
                            <p className="font-semibold text-white truncate">{user?.name || 'Guest User'}</p>
                            <p className="text-slate-400 truncate">{user?.email || 'No email'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="shrink-0 ml-2 p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 transition-all cursor-pointer group"
                    >
                        <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9"
                            />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Top Header Bar */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                        ☰ Menu
                    </button>
                    <div className="hidden lg:block text-sm font-medium text-slate-600">
                        Overview & Management Console
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ● System Online
                        </span>
                    </div>
                </header>

                {/* Page View Slot */}
                <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}