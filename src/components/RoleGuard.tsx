'use client';

import { useEffect } from 'react';

export default function RoleGuard({ userEmail }: { userEmail?: string }) {
  useEffect(() => {
    if (!userEmail) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/verify-role?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) return;
        
        const data = await res.json();

        // Case 1: Account was deleted by Admin
        if (!data.exists) {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = '/login?reason=deleted';
          return;
        }

        // Case 2: User is currently on /portal, but their role in DB is now ADMIN (Promoted!)
        if (window.location.pathname.startsWith('/portal') && data.role === 'ADMIN') {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = '/login?reason=promoted';
          return;
        }

        // Case 3: User is currently on /admin, but their role in DB is now USER (Demoted!)
        if (window.location.pathname.startsWith('/admin') && data.role === 'USER') {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = '/login?reason=demoted';
          return;
        }
      } catch (err) {
        console.error('Role guard sync failed', err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [userEmail]);

  return null; // Invisible component
}
