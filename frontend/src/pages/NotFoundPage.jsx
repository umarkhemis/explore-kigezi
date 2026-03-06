

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pt-16">
        <div className="text-8xl mb-6">🌍</div>
        <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-serif text-2xl font-bold text-kigezi-text mb-3">Page Not Found</h2>
        <p className="text-kigezi-muted max-w-md mb-8 leading-relaxed">
          Oops! Looks like you've wandered off the path in the Kigezi hills.
          This page doesn't exist — but plenty of amazing experiences do!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="btn-primary">🏠 Go Home</Link>
          <Link to="/experiences" className="btn-outline">🎭 Browse Experiences</Link>
        </div>
      </div>
    </div>
  );
}