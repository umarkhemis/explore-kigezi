import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="text-8xl mb-6">🏔️</div>
        <h1 className="font-serif text-5xl font-bold text-kigezi-text mb-4">404</h1>
        <p className="font-serif text-2xl text-kigezi-text mb-2">Lost in the Hills of Kigezi?</p>
        <p className="text-kigezi-muted max-w-md mb-8">
          The page you are looking for does not exist or has been moved. Let us guide you back to authentic Bakiga experiences.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/" className="btn-primary">
            🏠 Back to Home
          </Link>
          <Link to="/experiences" className="btn-outline">
            🌿 Browse Experiences
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
