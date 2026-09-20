import React from 'react';
import Link from 'next/link';

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -left-40 top-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute -right-40 top-1/3 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="relative z-10 text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Student Dashboard</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Welcome! Here you can track your applications, view feedback, and explore new opportunities.</p>
        <Link href="/" className="inline-flex px-8 py-3 bg-[#6366f1] hover:bg-[#4f46e5] rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
