

import React, { useState } from 'react';

export default function StarRating({ value = 0, onChange, size = 'md', showValue = true }) {
  const [hover, setHover] = useState(0);
  const interactive = !!onChange;
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          className={`${sizes[size]} transition-transform ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          disabled={!interactive}>
          <span className={(hover || value) >= star ? 'text-secondary' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
      {showValue && value > 0 && (
        <span className="text-sm font-semibold text-kigezi-text ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}