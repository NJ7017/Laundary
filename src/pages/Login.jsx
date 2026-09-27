import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/my-orders');
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@aurawash.com');
    setPassword('password123');
    setLoading(true);
    const res = await login('demo@aurawash.com', 'password123');
    setLoading(false);
    if (res.success) {
      navigate('/my-orders');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-8 shadow-xl flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-2xl font-bold">lock</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface mt-2">Welcome Back</h1>
          <p className="text-xs text-on-surface-variant">Sign in to manage your laundry pickups and delivery schedules.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-error-container/30 border border-error/20 text-xs font-semibold text-error flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Email Address</label>
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-on-surface">Password</label>
              <a href="#" className="text-[11px] font-semibold text-primary hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to AuraWash'}
          </button>
        </form>

        {/* 1-Click Demo Login Helper */}
        <div className="pt-2 border-t border-surface-container flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold rounded-xl transition-all border border-secondary/30 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">flash_on</span>
            <span>1-Click Demo Login (Sarah Jenkins)</span>
          </button>
        </div>

        <p className="text-xs text-center text-on-surface-variant">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
