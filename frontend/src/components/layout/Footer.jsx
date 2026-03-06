

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-700 text-white">
      <div className="page-wrapper py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌍</span>
              <span className="font-serif font-bold text-xl">Explore Kigezi</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Connecting curious travellers with authentic Bakiga cultural experiences
              in the beautiful Kigezi region of Uganda. 🇺🇬
            </p>
            <div className="flex gap-4 mt-5">
              {['facebook','instagram','twitter'].map(s => (
                <a key={s} href="#" aria-label={s}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <span className="text-sm capitalize">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Explore</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                { label: 'All Experiences', to: '/experiences' },
                { label: 'Traditional Dance', to: '/experiences?category=dance' },
                { label: 'Traditional Food',  to: '/experiences?category=food' },
                { label: 'Crafts & Artisan',  to: '/experiences?category=crafts' },
                { label: 'Village Visits',    to: '/experiences?category=village' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosts */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Hosts</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                { label: 'Become a Host',    to: '/host/register' },
                { label: 'Host Dashboard',   to: '/host/dashboard' },
                { label: 'Host Guidelines',  to: '#' },
                { label: 'Success Stories',  to: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Contact</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Kabale Town, Kigezi Region, Uganda</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:hello@explorekigezi.com" className="hover:text-white transition-colors">
                  hello@explorekigezi.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <span>+256 700 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © 2026 Explore Kigezi. Celebrating Bakiga Culture. 💚
          </p>
          <div className="flex gap-6 text-white/50 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}