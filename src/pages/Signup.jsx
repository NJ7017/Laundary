import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await signup({ name, email, phone, address, password });
    setLoading(false);
    if (res.success) {
      navigate('/book-pickup');
    } else {
      setErrorMsg(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-8 shadow-xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-2xl font-bold">person_add</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface mt-2">Create Your Account</h1>
          <p className="text-xs text-on-surface-variant">Join thousands enjoying fresh laundry delivered in 24 hours.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-error-container/30 border border-error/20 text-xs font-semibold text-error flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Michael Scott"
              required
              className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Primary Pickup Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Blossom Hill Rd, Springfield, OR"
              className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Create Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Registering Account...' : 'Create Account & Start Booking'}
          </button>
        </form>

        <p className="text-xs text-center text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
