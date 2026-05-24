import React, { createContext, useContext, useState } from 'react';

const SocketContext = createContext(null);

// ── Lightweight notification context (replaces socket.io) ──────────────
// Socket.io is not compatible with Vercel serverless. This context keeps
// the toast notification API intact so all consumers continue to work
// without any changes — just no real-time websocket push.
export const SocketProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    return (
        <SocketContext.Provider value={{ socket: null, showToast }}>
            {children}

            {/* Toast Notification Banner */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 99999,
                    background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                                'linear-gradient(135deg, #6366f1, #3b82f6)',
                    color: '#fff',
                    padding: '14px 22px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateY(30px) scale(0.9); opacity: 0; }
                            to { transform: translateY(0) scale(1); opacity: 1; }
                        }
                    `}</style>
                    <span>{toast.msg}</span>
                </div>
            )}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
