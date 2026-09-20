'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

type Idea = {
  id: string;
  participationType: string;
  teamName: string | null;
  teamLeader: string | null;
  teamMembers: string | null;
  universityName: string | null;
  segment: string | null;
  category: string | null;
  title: string;
  problemStatement: string;
  solution: string;
  stage: string;
  deckUrl: string | null;
  resumeUrl: string | null;
  nidUrls: string | null;
  universityIdUrl: string | null;
  videoUrl: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  registration: {
    fullName: string;
    email: string;
    phone: string | null;
  };
};

const getFileUrl = (url: string | null) => {
  if (!url || url.trim() === '' || url === 'null' || url === 'undefined' || url === 'Attached') return null;
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) return url;
  return `/uploads/${url}`;
};

const getEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    // skip
  }
  return url;
};

const getViewerUrl = (url: string | null) => {
  const finalUrl = getFileUrl(url);
  if (!finalUrl) return null;

  const lowerUrl = finalUrl.toLowerCase();
  if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx')) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const absoluteUrl = finalUrl.startsWith('http') ? finalUrl : `${origin}${finalUrl}`;
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absoluteUrl)}`;
  }
  return finalUrl;
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'USERS' | 'IDEAS'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>('');
  const scrollContainerRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchpadWheel = (e: WheelEvent) => {
      // Ensure two-finger trackpad deltaY is explicitly applied to scroll position
      if (Math.abs(e.deltaY) > 0) {
        container.scrollTop += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleTouchpadWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleTouchpadWheel);
  }, []);

  // Modal Preview State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewTitle('');
  };

  // Edit State for Users
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const res = await fetch('/api/admin/ideas');
      const data = await res.json();
      if (res.ok) setIdeas(data);
    } catch (error) {
      console.error("Failed to fetch ideas", error);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const fetchAdminIdentity = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentAdminEmail(data.email);
      }
    } catch (error) {
      console.error("Failed to fetch admin identity", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchIdeas();
    fetchAdminIdentity();
  }, []);

  // --- User Handlers ---
  const handleToggleAdmin = async (id: string, userEmail: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const actionText = currentRole === 'ADMIN' ? 'revoke admin privileges from' : 'promote this user to Admin';
    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, role: newRole })
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditFullName(user.fullName);
    setEditPhone(user.phone || '');
  };

  const saveEditUser = async (id: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: id, fullName: editFullName, phone: editPhone })
      });
      if (res.ok) {
        setEditingUserId(null);
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Idea Handlers ---
  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/ideas/${ideaId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setIdeas(prevIdeas => 
          prevIdeas.map(idea => 
            idea.id === ideaId ? { ...idea, status: newStatus as any } : idea
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const pendingIdeasCount = ideas.filter(i => i.status === 'PENDING').length;

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIdeas = ideas.filter((idea) => {
    const email = idea.registration?.email || '';
    return email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#060a16] flex flex-col md:flex-row text-white font-sans">
      <RoleGuard userEmail={currentAdminEmail} />
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a1226] border-r border-slate-300 dark:border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto z-20">
        <div>
          {/* Left Top Header (Inside <aside>) */}
          <div className="bg-[#e8edf5] border-b border-slate-300 dark:border-white/10 p-6 h-auto md:h-28 flex flex-col items-center justify-center">
            <Link href="/" className="inline-block">
              <img 
                src="/footerlogo.png" 
                alt="D2V Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>
            <div className="mt-1.5 text-slate-900 font-extrabold tracking-widest text-xs">
              ADMIN PORTAL
            </div>
          </div>

          <nav className="px-4 space-y-2 mt-6">
            <button
              onClick={() => setActiveTab('USERS')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'USERS' 
                  ? 'bg-blue-600/20 border border-blue-500 text-white font-semibold' 
                  : 'border border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm">Users</span>
              </div>
              <span className="text-xs bg-slate-800 text-white px-2.5 py-0.5 rounded-full border border-slate-600 font-bold shadow-sm">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('IDEAS')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'IDEAS' 
                  ? 'bg-blue-600/20 border border-blue-500 text-white font-semibold' 
                  : 'border border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm">Ideas</span>
              </div>
              <div className="flex items-center gap-1.5">
                {pendingIdeasCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-amber-950 font-bold border border-amber-400 px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                    {pendingIdeasCount} pending
                  </span>
                )}
                <span className="text-xs bg-slate-800 text-white px-2.5 py-0.5 rounded-full border border-slate-600 font-bold shadow-sm">{ideas.length}</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 mt-auto md:absolute md:bottom-0 md:w-full bg-[#0a1226]">
            <button 
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-sm font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </aside>

      {/* Main Content Area (Right Workspace) */}
      <div className="flex-1 h-screen relative flex flex-col overflow-hidden">
        {/* Right Top Header */}
        <header className="shrink-0 z-10 bg-[#e8edf5] border-b border-slate-300 dark:border-white/10 px-6 md:px-10 flex justify-between items-center h-auto md:h-28 pointer-events-auto">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {activeTab === 'USERS' ? 'Users Management' : 'Submitted Ideas'}
            </h1>
            <p className="text-slate-600 font-semibold text-sm mt-1">
              {activeTab === 'USERS' 
                ? 'Manage registered participants and admin roles.' 
                : 'Review pitches, manage status, and download attachments.'}
            </p>
          </div>

          <div className="relative w-64 md:w-72 mx-auto hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-9 pr-8 py-1.5 text-xs md:text-sm bg-white border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentAdminEmail && (
              <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-500 font-semibold uppercase">Admin:</span>
                <span className="text-slate-900 font-bold">{currentAdminEmail}</span>
              </div>
            )}
            <button 
              onClick={activeTab === 'USERS' ? fetchUsers : fetchIdeas} 
              className="p-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <svg className={`w-5 h-5 ${(activeTab === 'USERS' ? isLoadingUsers : isLoadingIdeas) ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dedicated Scrollable Content Area */}
        <main 
          ref={scrollContainerRef}
          tabIndex={0}
          className="flex-1 h-full overflow-y-scroll overflow-x-hidden p-6 md:p-10 pb-10 relative outline-none"
          style={{ 
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'auto',
            pointerEvents: 'auto'
          }}
        >
          {activeTab === 'USERS' && (
            <div className="bg-[#0b1329]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider">
                      <th className="p-5 font-semibold whitespace-nowrap">User</th>
                      <th className="p-5 font-semibold whitespace-nowrap">Contact</th>
                      <th className="p-5 font-semibold whitespace-nowrap">Role</th>
                      <th className="p-5 font-semibold whitespace-nowrap">Joined</th>
                      <th className="p-5 font-semibold text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoadingUsers ? (
                      <tr><td colSpan={5} className="p-10 text-center text-slate-400">Loading users...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-slate-400">{searchQuery ? 'No users match your search.' : 'No users found in the system.'}</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="p-5">
                            {editingUserId === user.id ? (
                              <input 
                                type="text" 
                                value={editFullName} 
                                onChange={(e) => setEditFullName(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded px-3 py-1.5 w-full text-sm outline-none focus:border-blue-500 text-white"
                              />
                            ) : (
                              <div className="font-semibold text-white whitespace-nowrap">{user.fullName}</div>
                            )}
                            <div className="text-[11px] text-slate-500 mt-1 font-mono">{user.id}</div>
                          </td>
                          <td className="p-5">
                            <div className="text-sm text-slate-300">{user.email}</div>
                            {editingUserId === user.id ? (
                              <input 
                                type="text" 
                                value={editPhone} 
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded px-3 py-1.5 w-full text-sm outline-none focus:border-blue-500 text-white mt-1"
                                placeholder="Phone number"
                              />
                            ) : (
                              <div className="text-[11px] text-slate-500 mt-1">{user.phone || 'No phone provided'}</div>
                            )}
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-5 text-sm text-slate-400 whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-5 text-right space-x-2 whitespace-nowrap">
                            {editingUserId === user.id ? (
                              <>
                                <button onClick={() => saveEditUser(user.id)} className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-xs font-bold transition-colors">Save</button>
                                <button onClick={() => setEditingUserId(null)} className="px-3 py-1.5 bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border border-slate-500/30 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                              </>
                            ) : (
                              <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                {user.email !== currentAdminEmail && (
                                  <button 
                                    onClick={() => handleToggleAdmin(user.id, user.email, user.role)} 
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                                      user.role === 'ADMIN' 
                                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30' 
                                        : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30'
                                    }`}
                                  >
                                    {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                  </button>
                                )}
                                <button onClick={() => startEditUser(user)} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs font-bold transition-colors">Edit</button>
                                <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-bold transition-colors">Del</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'IDEAS' && (
            <div className="space-y-6">
              {isLoadingIdeas ? (
                <div className="p-10 text-center text-slate-400 bg-[#0b1329] border border-white/5 rounded-2xl">Loading ideas...</div>
              ) : filteredIdeas.length === 0 ? (
                <div className="p-10 text-center text-slate-400 bg-[#0b1329] border border-white/5 rounded-2xl">{searchQuery ? 'No ideas match your search.' : 'No ideas submitted yet.'}</div>
              ) : (
                filteredIdeas.map((idea, idx) => (
                  <div key={idea.id} className="bg-[#0b1329]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl transition-all hover:border-indigo-500/30">
                    
                    {/* Header & Status */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-black tracking-widest px-3 py-1 rounded-md bg-white/5 text-slate-300 uppercase">
                            #{String(idx + 1).padStart(3, '0')}
                          </span>
                          <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {idea.segment || idea.category || 'General'}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">
                            Stage: {idea.stage}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">
                          {idea.title}
                        </h2>
                      </div>
                      
                      {/* Live Status Control */}
                      <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/5">
                        {['PENDING', 'ACCEPTED', 'REJECTED'].map((status) => {
                          const isActive = idea.status === status;
                          let activeClasses = '';
                          if (isActive) {
                            if (status === 'PENDING') activeClasses = 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
                            if (status === 'ACCEPTED') activeClasses = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
                            if (status === 'REJECTED') activeClasses = 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
                          }
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(idea.id, status)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                isActive 
                                  ? activeClasses 
                                  : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Left: Applicant Details */}
                      <div className="md:col-span-4 space-y-4">
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Applicant Info</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-400">Account Name</div>
                              <div className="text-sm font-medium text-white">{idea.registration.fullName}</div>
                              <div className="text-xs text-slate-500">{idea.registration.email}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">Participation Type</div>
                              <div className="text-sm font-medium text-white">{idea.participationType}</div>
                            </div>
                            {idea.teamName && (
                              <div>
                                <div className="text-xs text-slate-400">Team Details</div>
                                <div className="text-sm font-medium text-white">{idea.teamName}</div>
                                <div className="text-xs text-slate-500">Lead: {idea.teamLeader}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-slate-400">University</div>
                              <div className="text-sm font-medium text-white">{idea.universityName || 'Not specified'}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Attachments</h4>
                          <div className="space-y-2 flex flex-col">
                            {getFileUrl(idea.resumeUrl) ? (
                              <button onClick={() => openPreview(getFileUrl(idea.resumeUrl)!, 'Resume')} className="text-xs flex items-center gap-2 p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-colors w-full text-left">
                                <span>📋</span> View Resume
                              </button>
                            ) : (
                              <div className="text-[10px] leading-tight flex items-start gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                <span className="mt-0.5">📋</span> File not properly uploaded. Please ask participant to re-upload.
                              </div>
                            )}
                            
                            {getFileUrl(idea.nidUrls) ? (
                              <button onClick={() => openPreview(getFileUrl(idea.nidUrls)!, 'NID Card')} className="text-xs flex items-center gap-2 p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-colors w-full text-left">
                                <span>🪪</span> View NID
                              </button>
                            ) : (
                              <div className="text-[10px] leading-tight flex items-start gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                <span className="mt-0.5">🪪</span> File not properly uploaded. Please ask participant to re-upload.
                              </div>
                            )}

                            {getFileUrl(idea.universityIdUrl) ? (
                              <button onClick={() => openPreview(getFileUrl(idea.universityIdUrl)!, 'Student ID')} className="text-xs flex items-center gap-2 p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-colors w-full text-left">
                                <span>🎓</span> View Student ID
                              </button>
                            ) : (
                              <div className="text-[10px] leading-tight flex items-start gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                <span className="mt-0.5">🎓</span> Student ID not uploaded or missing.
                              </div>
                            )}
                            
                            {getViewerUrl(idea.deckUrl) ? (
                              <button onClick={() => openPreview(getViewerUrl(idea.deckUrl)!, 'Pitch Deck / Presentation')} className="text-xs flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors w-full text-left">
                                <span>📊</span> View Pitch Deck
                              </button>
                            ) : (
                              <div className="text-[10px] leading-tight flex items-start gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                <span className="mt-0.5">📊</span> File not properly uploaded. Please ask participant to re-upload.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Pitch Details */}
                      <div className="md:col-span-8 space-y-6">
                        <div>
                          <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">Problem Statement</h4>
                          <div className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                            {idea.problemStatement}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">Solution Overview</h4>
                          <div className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                            {idea.solution}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">Video Pitch / Demo</h4>
                          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            {idea.videoUrl && idea.videoUrl !== 'null' && idea.videoUrl !== 'undefined' ? (
                              idea.videoUrl.startsWith('/uploads') || idea.videoUrl.match(/\.(mp4|webm)$/i) ? (
                                <button onClick={() => openPreview(getFileUrl(idea.videoUrl)!, 'Video Pitch')} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                  <span>🎥</span> Watch Pitch Video
                                </button>
                              ) : (
                                getEmbedUrl(idea.videoUrl) !== idea.videoUrl ? (
                                  <iframe src={getEmbedUrl(idea.videoUrl)} className="w-full max-w-2xl aspect-video rounded-xl border border-white/10 shadow-lg" allowFullScreen />
                                ) : (
                                  <a href={idea.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-sm font-bold transition-colors">
                                    <span>🔗</span> Open Video Link
                                  </a>
                                )
                              )
                            ) : (
                              <div className="text-sm text-slate-500 italic">No demo video submitted.</div>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 text-right">
                          Submitted on {new Date(idea.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Document Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-[#0b1329] border border-white/10 rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-4">
                {previewTitle}
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-normal flex items-center gap-1">
                  Open in new tab ↗
                </a>
              </h3>
              <button onClick={closePreview} className="text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors font-bold text-sm">
                ✕ Close
              </button>
            </div>
            <div className="flex-1 bg-black/50 p-4 overflow-hidden flex items-center justify-center relative">
              {(previewUrl.toLowerCase().match(/\.(mp4|webm)$/) != null) ? (
                <video controls autoPlay className="w-full max-h-[75vh] rounded-xl outline-none shadow-2xl bg-black">
                  <source src={previewUrl} type={previewUrl.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              ) : (previewUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/) != null) || previewUrl.startsWith('data:image') ? (
                <img src={previewUrl} alt={previewTitle} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              ) : (
                <iframe src={previewUrl} className="w-full h-full border-0 rounded-lg bg-white shadow-2xl" title={previewTitle}></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
