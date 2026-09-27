import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book a Pickup', path: '/book-pickup' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'My Orders', path: '/my-orders' },
    { name: 'About & Contact', path: '/about-contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="h-20 max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-space-sm shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-2xl font-bold">local_laundry_service</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-xl text-primary font-extrabold tracking-tight">AuraWash</span>
              <span className="text-[10px] font-semibold text-secondary -mt-1 tracking-wider uppercase">Fabric Care</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-lg">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-space-xs font-semibold text-sm transition-colors ${
                  active
                    ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-space-sm md:gap-space-md shrink-0">
          {/* Phone Helpline */}
          <a
            href="tel:+919823456789"
            className="hidden sm:flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container-low text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-primary text-lg">call</span>
            <span>+91 98234 56789</span>
          </a>

          {/* Book Pickup Button */}
          <Link
            to="/book-pickup"
            className="hidden md:flex items-center justify-center bg-primary text-on-primary hover:bg-primary-container px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_16px_-2px_rgba(0,97,148,0.25)] transition-all hover:-translate-y-0.5"
          >
            Book Pickup
          </Link>

          {/* User Account State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-container-low transition-all border border-surface-container"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-on-surface leading-tight">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-on-surface-variant">Active Account</span>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-surface-container">
                    <p className="text-xs font-bold text-on-surface">{user.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/my-orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">local_shipping</span>
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/book-pickup"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-secondary">add_circle</span>
                    <span>Schedule New Pickup</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-error hover:bg-error-container/20 transition-colors border-t border-surface-container"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-bold text-on-surface-variant hover:text-primary rounded-xl hover:bg-surface-container-low transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-bold text-primary bg-primary-fixed/40 hover:bg-primary-fixed rounded-xl transition-colors border border-primary-fixed"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-surface-container px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 text-sm font-semibold ${
                isActive(link.path) ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-surface-container flex flex-col gap-2">
            <Link
              to="/book-pickup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-md"
            >
              Book a Pickup
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
