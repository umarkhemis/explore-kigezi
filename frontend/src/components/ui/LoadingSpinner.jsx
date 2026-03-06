

import React from 'react';

export default function LoadingSpinner({ size = 'md', center = false }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const spinner = (
    <div className={`${sizes[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`} />
  );
  if (center) return (
    <div className="flex items-center justify-center w-full py-20">{spinner}</div>
  );
  return spinner;
}