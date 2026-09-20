'use client';

import React from 'react';

export default function LogoutButton({ className, children }: { className?: string, children: React.ReactNode }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}
