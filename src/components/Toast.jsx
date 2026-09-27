import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast } = useAuth();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  const bgColor = isError ? 'bg-error text-on-error' : isInfo ? 'bg-inverse-surface text-inverse-on-surface' : 'bg-secondary text-on-secondary';
  const icon = isError ? 'error' : isInfo ? 'info' : 'check_circle';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl shadow-black/10 text-sm font-semibold tracking-wide ${bgColor}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
