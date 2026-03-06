

import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '🔍', title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-6xl mb-5">{icon}</div>
      <h3 className="font-serif text-2xl font-bold text-kigezi-text mb-3">{title}</h3>
      <p className="text-kigezi-muted max-w-sm leading-relaxed">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6 inline-block">{actionLabel}</Link>
      )}
    </div>
  );
}