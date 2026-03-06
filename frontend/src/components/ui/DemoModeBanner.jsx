import React from 'react';

export default function DemoModeBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
      <span className="text-lg">⚠️</span>
      <span>
        <strong>Demo Mode:</strong> Showing sample data — the backend API is not connected.
      </span>
    </div>
  );
}
