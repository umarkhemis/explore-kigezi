

import React from 'react';

const variants = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  paid:      'bg-green-100 text-green-800',
  failed:    'bg-red-100 text-red-800',
  active:    'bg-green-100 text-green-800',
  inactive:  'bg-gray-100 text-gray-600',
  approved:  'bg-green-100 text-green-800',
  rejected:  'bg-red-100 text-red-800',
  verified:  'bg-primary/10 text-primary',
  default:   'bg-gray-100 text-gray-700',
};

export default function Badge({ label, variant = 'default', className = '' }) {
  const cls = variants[variant] || variants.default;
  return (
    <span className={`badge ${cls} ${className}`}>
      {label || variant}
    </span>
  );
}