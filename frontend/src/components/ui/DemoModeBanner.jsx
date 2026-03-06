


import React, { useState } from 'react';

export default function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-secondary/90 text-white text-sm py-2 px-4 flex items-center justify-between z-40 relative">
      <span>
        ⚠️ <strong>Demo Mode</strong> — Running with sample data.
        Connect your Django backend at <code className="bg-white/20 px-1 rounded">http://localhost:8000</code> to see live data.
      </span>
      <button onClick={() => setDismissed(true)}
        className="ml-4 hover:opacity-75 font-bold text-lg leading-none">×</button>
    </div>
  );
}