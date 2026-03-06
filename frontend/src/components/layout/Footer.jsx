import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-16">
      <div className="page-wrapper py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-serif font-bold text-xl mb-3 flex items-center gap-2">
              <span>🏔️</span> Explore Kigezi
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Connecting travellers with authentic Bakiga cultural experiences in Kigezi, Uganda.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/experiences" className="hover:text-white transition-colors">Experiences</Link></li>
              <li><Link to="/host/register" className="hover:text-white transition-colors">Become a Host</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>📍 Kabale, Kigezi, Uganda</li>
              <li>📧 hello@explorekigezi.com</li>
              <li>📱 +256 700 000 000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Explore Kigezi. All rights reserved. MIT License.
        </div>
      </div>
    </footer>
  );
}
