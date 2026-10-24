import React, { useEffect } from 'react';

export default function Modal({
    show = false,
    onClose,
    title,
    description,
    children,
    maxWidth = 'lg',
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show && onClose) {
                onClose();
            }
        };

        if (show) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [show, onClose]);

    if (!show) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
    }[maxWidth] || 'max-w-lg';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            />

            {/* Modal Dialog Card */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`relative w-full ${maxWidthClasses} transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl border border-slate-100 transition-all animate-in zoom-in-95 fade-in duration-200`}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-slate-50 to-white">
                        <div>
                            {title && (
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="mt-1 text-xs text-slate-500 font-medium">
                                    {description}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
