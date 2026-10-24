import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
    show = false,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isDanger = true,
    processing = false,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="text-center">
                <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                        isDanger ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                >
                    {isDanger ? (
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    ) : (
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                            isDanger
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20'
                        }`}
                    >
                        {processing && (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        )}
                        <span>{processing ? 'Processing...' : confirmText}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
