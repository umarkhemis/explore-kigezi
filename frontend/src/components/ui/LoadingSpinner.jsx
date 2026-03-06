import React from 'react';

export default function LoadingSpinner({ center = false, size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const spinner = (
    <div
      className={`animate-spin rounded-full border-4 border-kigezi-border border-t-primary ${sizes[size] || sizes.md}`}
    />
  );

  if (center) {
    return (
      <div className="flex justify-center items-center py-16">
        {spinner}
      </div>
    );
  }

  return spinner;
}
