'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup';
  
  const [isSignUp, setIsSignUp] = useState(initialMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Alert Modal State
  const [showAlert, setShowAlert] = useState(false);

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setShowAlert(true);
        } else {
          setLoginError(data.error || data.message || 'Login failed');
        }
        return;
      }

      if (data.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        // Strict routing for USER role to portal
        router.push('/portal');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match");
      return;
    }
    
    setIsRegistering(true);
    setRegError('');
    setRegSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          phone: regPhone,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      setRegSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        setLoginEmail(regEmail);
        setIsSignUp(false);
        setRegFullName('');
        setRegPhone('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegSuccess('');
      }, 1500);

    } catch (err: any) {
      setRegError(err.message || 'An error occurred during registration');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl min-h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-row">
      
      {/* 
        Overlapping Animated Overlay 
        Moves from left-0 (covers Registration) to translate-x-full (covers Sign In).
        When isSignUp is true, it moves right, exposing the left side.
      */}
      <div 
        className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 z-50 text-white flex flex-col items-center justify-center p-12 text-center transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full space-y-6">
          <Image 
            alt="D2V Logo" 
            src="/footerlogo.png" 
            width={160} 
            height={50} 
            className="mb-4 object-contain"
            style={{ filter: 'drop-shadow(0px 4px 12px rgba(255, 255, 255, 0.25))' }}
          />
          <h2 className="text-4xl font-bold text-white">
            {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
          </h2>
          <p className="text-blue-100 text-lg max-w-xs">
            {isSignUp 
              ? 'To keep connected with us please login with your personal info' 
              : 'Enter your personal details and start your journey with us'}
          </p>
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setLoginError('');
              setRegError('');
            }}
            className="px-10 py-3 rounded-full border-2 border-white text-white font-bold tracking-wider hover:bg-white hover:text-[#f35c24] transition-colors uppercase text-sm mt-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        
        {/* Animated Background shapes inside overlay */}
        <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Registration Form (Left Side Container) */}
      <div className={`w-1/2 h-full absolute top-0 left-0 px-10 py-6 flex flex-col justify-center transition-all duration-700 overflow-y-auto ${isSignUp ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-0 -translate-x-full pointer-events-none'}`}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
        </div>

        {regError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {regError}
          </div>
        )}
        {regSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg text-center">
            {regSuccess}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">FULL NAME *</label>
            <input 
              type="text" 
              placeholder="Your full name" 
              required
              value={regFullName}
              onChange={(e) => setRegFullName(e.target.value)}
              className="w-full bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-slate-900 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">MOBILE *</label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX" 
              required
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              className="w-full bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-slate-900 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">EMAIL *</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-slate-900 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">PASSWORD *</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="At least 8 characters" 
                required
                minLength={8}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-slate-900 outline-none transition-all pr-12"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">CONFIRM PASSWORD *</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Repeat your password" 
                required
                minLength={8}
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-slate-900 outline-none transition-all pr-12"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isRegistering}
            className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-70 mt-2 shadow-lg shadow-purple-500/30 uppercase tracking-wide text-sm flex justify-center items-center"
          >
            {isRegistering ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Register Now'}
          </button>
        </form>
      </div>

      {/* Sign In Form (Right Side Container) */}
      <div className={`w-1/2 h-full absolute top-0 right-0 p-12 flex flex-col justify-center transition-all duration-700 ${isSignUp ? 'opacity-0 z-0 translate-x-full pointer-events-none' : 'opacity-100 z-20 translate-x-0'}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Sign in to D2V</h2>
        </div>
        
        {loginError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="Email" 
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full bg-slate-100 px-4 py-3.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 ml-1">PASSWORD</label>
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-slate-100 px-4 py-3.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900 outline-none transition-all"
            />
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Forgot your password?</a>
          </div>
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-70 mt-4 shadow-lg shadow-blue-500/30 uppercase tracking-wide text-sm flex justify-center items-center"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full mx-4 shadow-2xl text-center transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">User Not Found!</h3>
            <p className="text-slate-600 mb-6">Please register first before trying to sign in.</p>
            <button
              onClick={() => {
                setShowAlert(false);
                setIsSignUp(true);
                setLoginError('');
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Go to Sign Up
            </button>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full py-3 mt-2 text-slate-500 hover:text-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Exit */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-end pointer-events-auto">
          <Link className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-[#0f172a] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md border hover:bg-[#f35c24] hover:text-white transition-all duration-300" href="/">
            <span>EXIT</span>
          </Link>
        </div>
      </header>

      {/* Auth Container wrapping Suspense for useSearchParams */}
      <div className="relative z-10 w-full flex justify-center perspective-[1000px] mt-12">
        <Suspense fallback={<div className="w-full max-w-4xl min-h-[650px] bg-white/5 rounded-3xl animate-pulse" />}>
          <AuthContent />
        </Suspense>
      </div>
    </main>
  );
}
