import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container py-14">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-xl font-bold">local_laundry_service</span>
              </div>
              <span className="text-xl font-extrabold text-primary tracking-tight">AuraWash</span>
            </Link>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              White-glove doorstep laundry pickup and botanical sanitization delivered in as fast as 24 hours. Eco-conscious detergents, hypoallergenic fabric treatment, and punctuality guaranteed.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-secondary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">verified</span> Hospital-Grade Hygiene
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">eco</span> 100% Eco-Detergents
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Services</h4>
            <Link to="/book-pickup" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Everyday Wash & Fold</Link>
            <Link to="/book-pickup" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Dry Cleaning & Steam</Link>
            <Link to="/book-pickup" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Bulky Linens & Bedding</Link>
            <Link to="/book-pickup" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Botanical Sanitization</Link>
          </div>

          {/* Customer Hub */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Navigation</h4>
            <Link to="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Home</Link>
            <Link to="/book-pickup" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Book a Pickup</Link>
            <Link to="/track-order" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Live Order Tracker</Link>
            <Link to="/my-orders" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Orders Dashboard</Link>
            <Link to="/about-contact" className="text-xs text-on-surface-variant hover:text-primary transition-colors">About & Contact</Link>
          </div>

          {/* Contact / Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Direct Concierge</h4>
            <p className="text-xs text-on-surface-variant">Questions or urgent care instructions?</p>
            <a href="tel:+919823456789" className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline">
              <span className="material-symbols-outlined text-base">phone</span> +91 98234 56789
            </a>
            <p className="text-xs text-on-surface-variant">Mon – Sat: 7:00 AM – 9:00 PM</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© 2026 AuraWash Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
