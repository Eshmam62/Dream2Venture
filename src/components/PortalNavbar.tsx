'use client';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { useEffect, useState } from 'react';

export default function PortalNavbar({ userEmail }: { userEmail?: string }) {
  const [email, setEmail] = useState(userEmail || '');

  useEffect(() => {
    if (!userEmail) {
      async function fetchEmail() {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            setEmail(data.email);
          }
        } catch (e) {
          // ignore
        }
      }
      fetchEmail();
    } else {
      setEmail(userEmail);
    }
  }, [userEmail]);

  return (
    <header className="border-b border-slate-300 dark:border-white/15 px-6 md:px-10 py-4 flex justify-between items-center bg-[#f4f6fa] sticky top-0 z-30 relative">
      <div className="flex items-center gap-6 md:ml-4">
        <Link href="/portal" className="flex items-center">
          <img 
            src="/footerlogo.png" 
            alt="D2V Logo" 
            className="h-14 md:h-16 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Centered Text */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1.5 select-none">
        <span className="text-[#0c2340] font-black tracking-wide text-xl drop-shadow-sm">PORTAL</span>
        <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-amber-400 bg-clip-text text-transparent font-black tracking-wide text-xl drop-shadow-sm">TRACKER</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white border border-slate-300 shadow-sm px-4 py-2 rounded-xl text-sm hidden sm:flex">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logged in:</span>
          <span className="font-medium text-slate-800">{email || '...'}</span>
        </div>
        <LogoutButton
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-colors text-sm font-bold shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="hidden sm:inline">Log Out</span>
        </LogoutButton>
      </div>
    </header>
  );
}
