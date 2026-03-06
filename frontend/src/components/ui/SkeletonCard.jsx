

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200 rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}