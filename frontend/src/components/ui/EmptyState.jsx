import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '🌿', title, message, ctaLabel, ctaTo }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-serif text-xl font-bold text-kigezi-text mb-2">{title}</h3>
      {message && <p className="text-kigezi-muted mb-6">{message}</p>}
      {ctaLabel && ctaTo && (
        <Link to={ctaTo} className="btn-primary inline-block">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
