'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import PortalNavbar from '@/components/PortalNavbar';

export default function PortalPage() {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    async function initSession() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.status === 401) {
          window.location.href = '/login';
          return;
        }
        
        const authData = await authRes.json();
        setCurrentUserEmail(authData.email);

        const portalRes = await fetch('/api/portal');
        if (portalRes.ok) {
          const portalData = await portalRes.json();
          // The API returns desc, we want asc for submission #01, #02...
          setIdeas((portalData.ideas || []).reverse());
        } else if (portalRes.status === 401) {
          window.location.href = '/login';
          return;
        }
      } catch (e) {
        console.error('Session validation error', e);
      } finally {
        setLoading(false);
      }
    }
    
    initSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a16] text-slate-100 flex flex-col font-sans items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading your portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a16] text-slate-100 flex flex-col font-sans">
      <RoleGuard userEmail={currentUserEmail} />
      <PortalNavbar userEmail={currentUserEmail} />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Submitted Ideas Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Total Submissions: <strong className="text-blue-400">{ideas.length}</strong>
            </p>
          </div>
          <Link
            href="/submission"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 text-sm"
          >
            + Submit Another Idea
          </Link>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-24 bg-[#0a1226]/50 rounded-3xl border border-white/5">
            <p className="text-slate-400 text-base">You haven&apos;t submitted any ideas yet.</p>
            <Link
              href="/submission"
              className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:underline"
            >
              Submit your first idea →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea, index) => {
              const submissionNumber = String(index + 1).padStart(2, '0');
              return (
                <div
                  key={idea.id}
                  className="bg-[#0b1329] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl transition space-y-5 hover:border-blue-500/40 relative overflow-hidden"
                >
                  {/* Top Bar with Sequence Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 01, 02, 03 Submission Tag */}
                        <span className="text-xs font-black tracking-widest px-3 py-1 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase shadow-sm">
                          Submission #{submissionNumber}
                        </span>
                        <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {idea.segment || idea.category || 'General'}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          Stage: {idea.stage}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-wide pt-2">
                        {idea.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
                          idea.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : idea.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        ● {idea.status}
                      </span>

                      <Link
                        href={`/submission?edit=${idea.id}`}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white transition shadow-sm"
                      >
                        Edit Idea
                      </Link>
                    </div>
                  </div>

                  {/* Form Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-black/25 p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase">Type</span>
                      <p className="text-slate-200 mt-0.5 font-medium">{idea.participationType}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase">Team / Leader</span>
                      <p className="text-slate-200 mt-0.5 font-medium">
                        {idea.teamName ? `${idea.teamName}` : (idea.teamLeader || 'Individual')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase">University</span>
                      <p className="text-slate-200 mt-0.5 font-medium">{idea.universityName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase">Submitted On</span>
                      <p className="text-slate-200 mt-0.5 font-medium">{new Date(idea.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Problem & Solution Preview */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Problem Statement</h4>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        {idea.problemStatement}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Solution</h4>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        {idea.solution}
                      </p>
                    </div>
                  </div>

                  {/* File & Pitch links */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-white/5 text-slate-400">
                    <span>📄 Deck: <strong className="text-slate-200">{idea.deckUrl || 'Attached'}</strong></span>
                    {idea.videoUrl && (
                      <span>🎥 Video: <a href={idea.videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{idea.videoUrl}</a></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}