import React from 'react';

const VARIANTS = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-700',
};

export default function Badge({ label, variant }) {
  const cls = VARIANTS[variant] || VARIANTS.default;
  return (
    <span className={`badge ${cls}`}>
      {label ? label.charAt(0).toUpperCase() + label.slice(1) : '—'}
    </span>
  );
}
