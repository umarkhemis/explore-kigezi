

import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-kigezi-border">
            <h3 className="font-serif text-xl font-bold text-kigezi-text">{title}</h3>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-kigezi-muted transition-colors">
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}