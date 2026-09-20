'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PortalNavbar from '@/components/PortalNavbar';

function SubmissionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId && editId !== 'true';

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [ideaId, setIdeaId] = useState<string | null>(isEditMode ? editId : null);

  const [participationType, setParticipationType] = useState<'INDIVIDUAL' | 'GROUP'>('INDIVIDUAL');
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [universityName, setUniversityName] = useState('');
  
  const [universityIdFile, setUniversityIdFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [universityError, setUniversityError] = useState('');
  const [nidFiles, setNidFiles] = useState<File[]>([]);
  const [nidError, setNidError] = useState('');

  const [existingFiles, setExistingFiles] = useState<{resume?: boolean; nid?: boolean; deck?: boolean; video?: boolean}>({});

  const [deckUrl, setDeckUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [nidUrlsStr, setNidUrlsStr] = useState('');
  const [univIdUrl, setUnivIdUrl] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const uploadFileImmediately = async (file: File, key: string) => {
    setIsUploading(prev => ({...prev, [key]: true}));
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      setIsUploading(prev => ({...prev, [key]: false}));
      return data.url || null;
    } catch(e) {
      setIsUploading(prev => ({...prev, [key]: false}));
      return null;
    }
  };
  const universityIdInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const nidInputRef = useRef<HTMLInputElement>(null);

  // --- Step 2 State ---
  const [step, setStep] = useState<1 | 2>(1);
  const segments = ['Digital & AI', 'Hardware & Engineering', 'Industry & Interface', 'Creative, Film & Media', 'Fashion Design', 'Social Consumer', 'Others'];
  const [segment, setSegment] = useState('');
  const [otherSegment, setOtherSegment] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [ideaStage, setIdeaStage] = useState('');
  
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [pitchDeckError, setPitchDeckError] = useState('');

  const pitchDeckInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isEditMode && editId) {
      const fetchIdea = async () => {
        try {
          const res = await fetch(`/api/ideas/${editId}`);
          if (res.ok) {
            const data = await res.json();
            const idea = data.idea;
            if (idea) {
              setIdeaId(idea.id);
              setParticipationType(idea.participationType);
              setTeamName(idea.teamName || '');
              setTeamLeader(idea.teamLeader || '');
              try {
                setTeamMembers(idea.teamMembers ? JSON.parse(idea.teamMembers) : []);
              } catch (e) {
                setTeamMembers([]);
              }
              setUniversityName(idea.universityName || '');
              
              if (!segments.includes(idea.category) && !segments.includes(idea.segment)) {
                setSegment('Others');
                setOtherSegment(idea.category || idea.segment);
              } else {
                setSegment(idea.category || idea.segment);
              }

              setIdeaTitle(idea.title);
              setProblemStatement(idea.problemStatement);
              setSolution(idea.solution);
              setIdeaStage(idea.stage);

              setExistingFiles({
                resume: !!idea.resumeUrl,
                nid: !!idea.nidUrls,
                deck: !!idea.deckUrl,
                video: !!idea.videoUrl
              });
              if (idea.deckUrl) setDeckUrl(idea.deckUrl);
              if (idea.resumeUrl) setResumeUrl(idea.resumeUrl);
              if (idea.nidUrls) setNidUrlsStr(idea.nidUrls);
              if (idea.universityIdUrl) setUnivIdUrl(idea.universityIdUrl);
              if (idea.videoUrl && idea.videoUrl.startsWith('/uploads')) setVidUrl(idea.videoUrl);
              
              if (idea.videoUrl && !idea.videoUrl.startsWith('/uploads')) {
                setVideoLink(idea.videoUrl);
              }
            }
          }
        } catch (e) {
          console.error('Error fetching idea data for edit mode', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchIdea();
    }
  }, [isEditMode, editId]);

  const handlePitchDeckChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPitchDeckError('');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!validTypes.includes(file.type)) {
        setPitchDeckError('Please upload a PDF, PPT, or PPTX file.');
        setPitchDeckFile(null);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setPitchDeckError('File size exceeds the 25MB limit.');
        setPitchDeckFile(null);
        return;
      }
      setPitchDeckFile(file);
      const url = await uploadFileImmediately(file, 'deck');
      if (url) setDeckUrl(url);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file);
      const url = await uploadFileImmediately(file, 'video');
      if (url) setVidUrl(url);
    }
  };

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleUniversityIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUniversityIdFile(file);
      const url = await uploadFileImmediately(file, 'univ');
      if (url) setUnivIdUrl(url);
    }
  };

  const handleNidChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNidError('');
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (files.some(f => f.size > 5 * 1024 * 1024)) {
          setNidError('One or more files exceed the 5MB limit.');
          return;
      }
      setNidFiles(files);
      setIsUploading(prev => ({...prev, nid: true}));
      const urls = [];
      for (const f of files) {
        const fd = new FormData();
        fd.append('file', f);
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          const data = await res.json();
          if (data.url) urls.push(data.url);
        } catch (err) {
          console.error(err);
        }
      }
      if (urls.length > 0) setNidUrlsStr(urls.join(','));
      setIsUploading(prev => ({...prev, nid: false}));
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError('');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setResumeError('Please upload a PDF file.');
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      const url = await uploadFileImmediately(file, 'resume');
      if (url) setResumeUrl(url);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setUniversityError('');
    setResumeError('');
    setNidError('');
    
    let hasError = false;

    if (!universityName.trim()) {
      setUniversityError('University Name is required.');
      hasError = true;
    }

    if (!resumeFile && !existingFiles.resume) {
      setResumeError('Resume upload is mandatory.');
      hasError = true;
    }

    if (nidFiles.length === 0 && !existingFiles.nid) {
      setNidError('National ID upload is mandatory.');
      hasError = true;
    }
    
    if (hasError) return;
    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPitchDeckError('');
    
    if (!segment || (segment === 'Others' && !otherSegment.trim())) {
      alert('Please select or specify an Idea Segment.');
      return;
    }

    if (!pitchDeckFile && !existingFiles.deck) {
      setPitchDeckError('Pitch Deck upload is mandatory.');
      return;
    }

    if (getWordCount(problemStatement) > 500) {
      alert('Problem statement exceeds 500 words.');
      return;
    }

    if (getWordCount(solution) > 500) {
      alert('Solution exceeds 500 words.');
      return;
    }

    if (!ideaStage) {
      alert('Please select the Current Idea Stage.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (ideaId) {
        formData.append('ideaId', ideaId);
      }
      formData.append('participationType', participationType);
      if (participationType === 'GROUP') {
        formData.append('teamName', teamName);
        formData.append('teamLeader', teamLeader);
        formData.append('teamMembers', JSON.stringify(teamMembers));
      }
      formData.append('universityName', universityName);
      
      if (univIdUrl) formData.append('universityIdUrl', univIdUrl);
      if (resumeUrl) formData.append('resumeUrl', resumeUrl);
      if (nidUrlsStr) formData.append('nidUrls', nidUrlsStr);
      
      formData.append('segment', segment === 'Others' ? otherSegment : segment);
      formData.append('title', ideaTitle);
      formData.append('problemStatement', problemStatement);
      formData.append('solution', solution);
      formData.append('stage', ideaStage);
      
      if (deckUrl) formData.append('deckUrl', deckUrl);
      if (vidUrl) formData.append('videoUrl', vidUrl);
      if (videoLink) formData.append('videoLink', videoLink);

      const res = await fetch('/api/submission', {
        method: ideaId ? 'PATCH' : 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Failed to submit idea');
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        router.push('/portal');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060a16] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a16] text-slate-100 flex flex-col font-sans">
      <PortalNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-6 sm:px-12 overflow-x-hidden text-slate-800">
        
        <div className="w-full flex justify-between items-center mb-6">
          <button 
            onClick={() => step === 1 ? router.push('/portal') : setStep(1)} 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {step === 1 ? 'Back to Tracker' : 'Back'}
          </button>
          {isEditMode && (
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              EDIT MODE
            </span>
          )}
        </div>
        {step === 1 && (
        <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in slide-in-from-left-8 duration-500">
          
          {/* Section 1: Participation Type */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Participation Details</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex-1 flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${participationType === 'INDIVIDUAL' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <input 
                  type="radio" 
                  name="participationType" 
                  value="INDIVIDUAL" 
                  checked={participationType === 'INDIVIDUAL'}
                  onChange={() => setParticipationType('INDIVIDUAL')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 font-semibold text-slate-800">Individual</span>
              </label>
              
              <label className={`flex-1 flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${participationType === 'GROUP' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <input 
                  type="radio" 
                  name="participationType" 
                  value="GROUP" 
                  checked={participationType === 'GROUP'}
                  onChange={() => setParticipationType('GROUP')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 font-semibold text-slate-800">Group / Squad</span>
              </label>
            </div>
          </div>

          {/* Dynamic Team Fields */}
          {participationType === 'GROUP' ? (
            <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Team Name / Squad Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your team name" 
                    required={participationType === 'GROUP'}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Team Leader Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter team leader name" 
                    required={participationType === 'GROUP'}
                    value={teamLeader}
                    onChange={(e) => setTeamLeader(e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              
              {teamMembers.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="md:col-start-2 relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Team Member Name *</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter team member name" 
                        required
                        value={member}
                        onChange={(e) => {
                          const newMembers = [...teamMembers];
                          newMembers[index] = e.target.value;
                          setTeamMembers(newMembers);
                        }}
                        className="flex-1 bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={() => setTeamMembers([...teamMembers, ''])}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-blue-300 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  ADD TEAM MEMBERS
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-10 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <p className="text-sm text-slate-600 font-medium">You will be registered as the primary applicant.</p>
            </div>
          )}

          <hr className="border-slate-100 mb-10" />

          {/* Section 2: University Details */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              University Details
            </h2>
            
            <div className="mb-6">
              <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>University Name</span>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">REQUIRED *</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter university name" 
                value={universityName}
                onChange={(e) => {
                  setUniversityName(e.target.value);
                  setUniversityError('');
                }}
                className={`w-full bg-white px-4 py-3 rounded-lg border ${universityError ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'} outline-none transition-all`}
              />
              {universityError && <p className="mt-2 text-xs font-medium text-red-500">{universityError}</p>}
            </div>

            {/* University ID Dropzone */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Upload University ID</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">OPTIONAL</span>
              </label>
              <div 
                onClick={() => universityIdInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-colors group"
              >
                <input 
                  type="file" 
                  ref={universityIdInputRef}
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleUniversityIdChange}
                />
                {universityIdFile || univIdUrl ? (
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      {isUploading['univ'] ? (
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 block">
                      {isUploading['univ'] ? 'Uploading...' : (universityIdFile ? universityIdFile.name : `Uploaded: ${univIdUrl.split('/').pop()}`)}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    <span className="text-sm font-medium text-slate-600 block">Click to upload (PNG, JPG, PDF)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* Section 3: Resume Upload */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              Resume / CV
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">REQUIRED *</span>
            </h2>
            
            {resumeError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                {resumeError}
              </div>
            )}
            
            <div 
              onClick={() => resumeInputRef.current?.click()}
              className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group ${resumeError ? 'border-red-300 bg-red-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
            >
              <input 
                type="file" 
                ref={resumeInputRef}
                className="hidden" 
                accept=".pdf"
                onChange={handleResumeChange}
              />
              {resumeFile || resumeUrl ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {isUploading['resume'] ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-800 block mb-1">
                    {isUploading['resume'] ? 'Uploading...' : (resumeFile ? resumeFile.name : `Uploaded: ${resumeUrl.split('/').pop()}`)}
                  </span>
                  {resumeFile && <span className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <svg className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700 block mb-1">Click to {existingFiles.resume ? 'update' : 'upload'} your Resume</span>
                  {existingFiles.resume && <span className="text-xs font-medium text-blue-500 block mb-1">Previously uploaded file found ✓</span>}
                  <span className="text-xs font-medium text-slate-500">Must be a PDF file (Max 5MB)</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* Section 4: National ID Upload */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              National ID / NID
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">REQUIRED *</span>
            </h2>

            <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-amber-800">
                Notice: Please upload clear photos of both the front and back sides of your National ID card (or a merged 2-sided PDF).
              </p>
            </div>
            
            {nidError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                {nidError}
              </div>
            )}
            
            <div 
              onClick={() => nidInputRef.current?.click()}
              className={`w-full min-h-[10rem] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors group ${nidError ? 'border-red-300 bg-red-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
            >
              <input 
                type="file" 
                ref={nidInputRef}
                className="hidden" 
                accept=".png,.jpg,.jpeg,.pdf"
                multiple
                onChange={handleNidChange}
              />
              {nidFiles.length > 0 || nidUrlsStr ? (
                <div className="w-full text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {isUploading['nid'] ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    )}
                  </div>
                  <div className="space-y-3">
                    {isUploading['nid'] ? (
                      <div className="text-sm font-bold text-slate-800">Uploading...</div>
                    ) : (
                      nidFiles.length > 0 ? (
                        nidFiles.map((file, i) => (
                          <div key={i} className="text-sm font-bold text-slate-800 flex flex-col items-center justify-center gap-1">
                            <span>{file.name}</span>
                            <span className="text-xs text-slate-500 font-normal">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        ))
                      ) : (
                        nidUrlsStr.split(',').map((url, i) => (
                          <div key={i} className="text-sm font-bold text-slate-800 flex flex-col items-center justify-center gap-1">
                            <span>Uploaded: {url.split('/').pop()}</span>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <svg className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700 block mb-1">Click to {existingFiles.nid ? 'update' : 'upload'} your NID Card (Both Sides)</span>
                  {existingFiles.nid && <span className="text-xs font-medium text-blue-500 block mb-1">Previously uploaded files found ✓</span>}
                  <span className="text-xs font-medium text-slate-500">Accepted formats: PDF, JPG, PNG (Upload front & back or a 2-page PDF, Max 5MB each)</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="submit" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-10 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
              NEXT STEP
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

        </form>
        )}

        {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in slide-in-from-right-8 duration-500">
          
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              Choose Segment / Category
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">REQUIRED *</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {segments.map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setSegment(seg)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${segment === seg ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  {seg}
                </button>
              ))}
            </div>
            {segment === 'Others' && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="text" 
                  placeholder="Specify other segment" 
                  required
                  value={otherSegment}
                  onChange={(e) => setOtherSegment(e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            )}
          </div>

          <hr className="border-slate-100 mb-10" />

          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              Idea Details
            </h2>
            
            <div className="mb-6">
              <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Idea Title</span>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">REQUIRED *</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter your idea title" 
                required
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Problem Statement</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold ${getWordCount(problemStatement) > 500 ? 'text-red-500' : 'text-slate-400'}`}>{getWordCount(problemStatement)} / 500 words</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">REQUIRED *</span>
                </div>
              </label>
              <textarea 
                placeholder="Enter problem statement" 
                required
                rows={5}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Solution</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold ${getWordCount(solution) > 500 ? 'text-red-500' : 'text-slate-400'}`}>{getWordCount(solution)} / 500 words</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">REQUIRED *</span>
                </div>
              </label>
              <textarea 
                placeholder="Enter your proposed solution" 
                required
                rows={5}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Current Idea Stage</span>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">REQUIRED *</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Ideation', 'Prototype', 'Launch'].map((stage) => (
                  <label key={stage} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${ideaStage === stage ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      name="ideaStage" 
                      value={stage} 
                      checked={ideaStage === stage}
                      onChange={() => setIdeaStage(stage)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="ml-3 font-semibold text-slate-800 text-sm leading-tight">{stage}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* Section: Uploads */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              Upload Pitch Deck / Presentation
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">REQUIRED *</span>
            </h2>
            
            {pitchDeckError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                {pitchDeckError}
              </div>
            )}
            
            <div 
              onClick={() => pitchDeckInputRef.current?.click()}
              className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group ${pitchDeckError ? 'border-red-300 bg-red-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
            >
              <input 
                type="file" 
                ref={pitchDeckInputRef}
                className="hidden" 
                accept=".pdf,.ppt,.pptx"
                onChange={handlePitchDeckChange}
              />
              {pitchDeckFile || deckUrl ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {isUploading['deck'] ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-800 block mb-1">
                    {isUploading['deck'] ? 'Uploading...' : (pitchDeckFile ? pitchDeckFile.name : `Uploaded: ${deckUrl.split('/').pop()}`)}
                  </span>
                  {pitchDeckFile && <span className="text-xs text-slate-500">{(pitchDeckFile.size / 1024 / 1024).toFixed(2)} MB</span>}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <svg className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700 block mb-1">Click to {existingFiles.deck ? 'update' : 'upload'} Pitch Deck</span>
                  {existingFiles.deck && <span className="text-xs font-medium text-blue-500 block mb-1">Previously uploaded deck found ✓</span>}
                  <span className="text-xs font-medium text-slate-500">Accepted formats: .pdf, .ppt, .pptx (Max 25MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Video Pitch
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => videoInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-colors group"
              >
                <input 
                  type="file" 
                  ref={videoInputRef}
                  className="hidden" 
                  accept=".mp4,.mov"
                  onChange={handleVideoChange}
                />
                {videoFile || vidUrl ? (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {isUploading['video'] ? (
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-800 block mb-1">
                      {isUploading['video'] ? 'Uploading...' : (videoFile ? videoFile.name : `Uploaded: ${vidUrl.split('/').pop()}`)}
                    </span>
                    {videoFile && <span className="text-xs text-slate-500">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</span>}
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <svg className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700 block mb-1">{existingFiles.video ? 'Update' : 'Upload'} Video File</span>
                    <span className="text-[10px] font-medium text-slate-500 block leading-tight">.mp4, .mov (Max 300MB, 2 mins)</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400">OR</span>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Video Link</label>
                <input 
                  type="url" 
                  placeholder="Enter video link (YouTube / Google Drive / Loom)" 
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-8 border-t border-slate-100">
            <button disabled={isSubmitting} type="submit" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-14 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (isEditMode ? 'UPDATING...' : 'SUBMITTING...') : (isEditMode ? 'UPDATE SUBMISSION' : 'SUBMIT')}
              {!isSubmitting && <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
            </button>
          </div>
        </form>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Thank You for Sharing Your Idea!</h3>
            <p className="text-slate-600 font-medium mb-8 leading-relaxed">
              We truly appreciate your time, effort, and creative initiative. Your idea submission has been successfully received, and our team will review it shortly.
            </p>
            <button 
              onClick={() => router.push('/portal')}
              className="inline-flex items-center justify-center w-full sm:w-auto px-10 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Go to My Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmissionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SubmissionContent />
    </Suspense>
  );
}
