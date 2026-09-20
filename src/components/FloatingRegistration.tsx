'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const FloatingRegistration = () => {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-center select-none">
      {/* 1. Code-Crafted High-Tech AI Bot Mascot */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 -mb-2.5 flex items-center justify-center pointer-events-none drop-shadow-[0_12px_20px_rgba(2,132,199,0.35)]"
      >
        <svg
          viewBox="0 0 140 120"
          className="w-16 h-14 sm:w-20 sm:h-16 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        {/* Antenna: Blue stem with pulsing D2V Orange beacon */}
        <line x1="70" y1="18" x2="70" y2="6" stroke="#0b2d6b" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="70" cy="5" r="4.5" fill="#ea3a18" />
        <circle cx="70" cy="5" r="7.5" fill="#f35c24" className="animate-ping" opacity="0.4" />

        {/* Left Ear Module: D2V Royal Blue with Orange Core */}
        <rect x="18" y="44" width="8" height="22" rx="4" fill="#0b2d6b" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="22" cy="55" r="2" fill="#ea3a18" />

        {/* Right Ear Module: D2V Royal Blue with Orange Core */}
        <rect x="114" y="44" width="8" height="22" rx="4" fill="#0b2d6b" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="118" cy="55" r="2" fill="#ea3a18" />

        {/* Helmet Outer Shell: Clean D2V White/Silver Ceramic with Royal Blue rim */}
        <rect
          x="24"
          y="18"
          width="92"
          height="72"
          rx="32"
          fill="url(#d2vWhiteShell)"
          stroke="#0b2d6b"
          strokeWidth="3"
        />

        {/* Visor Screen Glass */}
        <rect
          x="34"
          y="28"
          width="72"
          height="50"
          rx="20"
          fill="#071426"
          stroke="#18427d"
          strokeWidth="2"
        />

        {/* Top Glass Highlight Reflection */}
        <rect
          x="36"
          y="30"
          width="68"
          height="20"
          rx="10"
          fill="url(#glassReflection)"
          opacity="0.3"
        />

        {/* Left Eye: Vibrant Glowing Cyan */}
        <motion.ellipse
          cx="54"
          cy="52"
          rx="7"
          ry="9"
          fill="#38bdf8"
          filter="url(#neonGlow)"
          animate={{ scaleY: [1, 1, 0.1, 1, 1], x: [0, 1.5, -1.5, 0] }}
          transition={{
            scaleY: { repeat: Infinity, duration: 3.5, times: [0, 0.45, 0.5, 0.55, 1] },
            x: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          }}
        />
        <circle cx="56" cy="49" r="2.5" fill="#ffffff" />

        {/* Right Eye: Vibrant Glowing Cyan */}
        <motion.ellipse
          cx="86"
          cy="52"
          rx="7"
          ry="9"
          fill="#38bdf8"
          filter="url(#neonGlow)"
          animate={{ scaleY: [1, 1, 0.1, 1, 1], x: [0, 1.5, -1.5, 0] }}
          transition={{
            scaleY: { repeat: Infinity, duration: 3.5, times: [0, 0.45, 0.5, 0.55, 1] },
            x: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          }}
        />
        <circle cx="88" cy="49" r="2.5" fill="#ffffff" />

        {/* Friendly Smile */}
        <path
          d="M63 64 Q70 69 77 64"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Hands Resting on Button Rim: White body with D2V Orange accents */}
        <circle cx="44" cy="91" r="7" fill="#ffffff" stroke="#ea3a18" strokeWidth="2.5" />
        <circle cx="96" cy="91" r="7" fill="#ffffff" stroke="#ea3a18" strokeWidth="2.5" />

        {/* Gradients */}
        <defs>
          <linearGradient id="d2vWhiteShell" x1="24" y1="18" x2="116" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="glassReflection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>

      {/* 2. Registration Now Floating Action Button */ }
  <Link
    className="relative z-20 inline-flex items-center justify-center px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-[#E64A19] to-[#FF6E40] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_10px_26px_rgba(230,74,25,0.42)] hover:shadow-[0_14px_34px_rgba(230,74,25,0.58)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
    href="/login?mode=signup"
  >
    Registration Now
  </Link>
    </div >
  );
};

export default FloatingRegistration;
