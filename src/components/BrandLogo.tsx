'use client';

import React, { useState, useEffect } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12 md:h-14',
    lg: 'h-14 sm:h-16 md:h-20',
  };

  const padClasses = {
    sm: 'px-4 py-1.5',
    md: 'px-6 py-2.5 sm:px-7 sm:py-3',
    lg: 'px-8 py-3.5 sm:px-9 sm:py-4',
  };

  return (
    <div
      className={`inline-flex items-center justify-center transition-all duration-300 select-none ${padClasses[size]} ${className}`}
    >
      <img
        src="/footerlogo.png"
        alt="Dream 2 Venture"
        className={`${sizeClasses[size]} w-auto object-contain block`}
      />
    </div>
  );
};

export default BrandLogo;
