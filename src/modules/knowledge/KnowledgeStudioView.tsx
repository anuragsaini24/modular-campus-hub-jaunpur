'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  FileText,
  PlusCircle,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CampusDocument } from '@/types';

export function KnowledgeStudioView() {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [documents, setDocuments] = useState<CampusDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Upload state
  const [activeTab, setActiveTab] = useState<'upload' | 'compose'>('upload');
  const [uploadCategory, setUploadCategory] = useState('Hackathons');
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Quick Composer state
  const [composeTitle, setComposeTitle] = useState('');
  const [composeCategory, setComposeCategory] = useState('Academics & Campus');
  const [composeContent, setComposeContent] = useState('');

  // Inspection modal
  const [inspectDoc, setInspectDoc] = useState<CampusDocument | null>(null);

  // Search filter
  const [filterQuery, setFilterQuery] = useState('');

  const fetchDocuments = () => {
    setIsLoading(true);
    fetch('/api/knowledge')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((err) => console.error('Failed to load documents:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUnlock = (codeToTest?: string) => {
    const code = codeToTest || passcode;
    if (code.trim() === 'pit2026') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Team Passcode. Default demo passcode is "pit2026".');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please choose a file to upload (.pdf, .md, or .txt).');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setUploadSuccessMsg('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadTitle || selectedFile.name);
    formData.append('category', uploadCategory);
    formData.append('passcode', passcode || 'pit2026');

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'x-team-passcode': passcode || 'pit2026' },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccessMsg(`Successfully uploaded and indexed "${data.document.title}" (${data.document.chunkCount} chunks).`);
        setSelectedFile(null);
        setUploadTitle('');
        fetchDocuments();
      } else {
        setErrorMsg(data.error || 'Failed to upload document.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error uploading document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTitle.trim() || !composeContent.trim()) {
      setErrorMsg('Please enter both title and content.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setUploadSuccessMsg('');

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-team-passcode': passcode || 'pit2026',
        },
        body: JSON.stringify({
          title: composeTitle,
          category: composeCategory,
          content: composeContent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccessMsg(`Successfully published notice "${data.document.title}" live!`);
        setComposeTitle('');
        setComposeContent('');
        fetchDocuments();
      } else {
        setErrorMsg(data.error || 'Failed to publish notice.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error publishing notice.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document from the knowledge base?')) {
      return;
    }

    try {
      const res = await fetch(`/api/knowledge/${docId}`, {
        method: 'DELETE',
        headers: { 'x-team-passcode': passcode || 'pit2026' },
      });

      if (res.ok) {
        fetchDocuments();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete document.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting document.');
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-[#ffe17c] border-2 border-black rounded-2xl p-6 md:p-8 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-black text-[#ffe17c] flex items-center justify-center font-black shrink-0 border-2 border-black shadow-neo-sm">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl md:text-4xl uppercase tracking-tight text-black flex items-center gap-2">
              Team Knowledge Studio
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black text-[#ffe17c] border border-black">
                Admin
              </span>
            </h1>
            <p className="text-sm font-semibold text-black/80 mt-1 max-w-2xl">
              Upload official college circulars, rules, and announcements. All uploaded
              records are automatically chunked and ingested into the Gemma 4 RAG index.
            </p>
          </div>
        </div>

        {/* Passcode Unlock Bar */}
        <div className="shrink-0 bg-white border-2 border-black rounded-xl p-4 shadow-neo-sm">
          {isUnlocked ? (
            <div className="flex items-center gap-2 text-xs font-heading font-black uppercase text-emerald-700">
              <Unlock className="w-4 h-4" />
              <span>Studio Unlocked (Team Admin Mode)</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-black">
                <Lock className="w-4 h-4 text-black" />
                <span>Enter Team Passcode to Publish:</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="bg-slate-100 text-xs px-3 py-1.5 rounded-lg border-2 border-black font-mono focus:outline-none w-32"
                />
                <button
                  onClick={() => handleUnlock()}
                  className="neo-btn-yellow text-xs py-1.5 px-3 font-heading uppercase !shadow-neo-sm"
                >
                  Unlock
                </button>
              </div>
              <button
                onClick={() => handleUnlock('pit2026')}
                className="text-[11px] font-extrabold text-black underline underline-offset-2 text-left hover:text-black/70"
              >
                1-Click Judge Demo Unlock (pit2026)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-100 border-2 border-black text-xs font-bold text-red-900 flex items-center gap-2 shadow-neo-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      {uploadSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-100 border-2 border-black text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-neo-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Ingestion Studio (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-black rounded-2xl p-6 shadow-neo space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <h2 className="font-heading font-black text-xl uppercase text-black flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Ingest College Info
            </h2>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-lg border-2 border-black text-xs font-black">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'upload' ? 'bg-black text-[#ffe17c]' : 'text-black'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setActiveTab('compose')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'compose' ? 'bg-black text-[#ffe17c]' : 'text-black'
                }`}
              >
                Live Notice
              </button>
            </div>
          </div>

          {!isUnlocked && (
            <div className="p-4 rounded-xl bg-[#ffe17c]/40 border-2 border-black text-xs font-bold text-black flex items-start gap-2.5">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Read-Only Mode:</strong> Unlock with passcode <code>pit2026</code> above to upload documents or publish live notices.
              </div>
            </div>
          )}

          {activeTab === 'upload' ? (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  disabled={!isUnlocked || isUploading}
                  className="w-full bg-slate-100 border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none"
                >
                  <option value="Hackathons">Hackathons &amp; Events</option>
                  <option value="Project Teams">Project Teams &amp; Clubs</option>
                  <option value="Lost & Found">Lost &amp; Found</option>
                  <option value="Academics & Campus">Academics &amp; Facilities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hacktoberfest Swag Rules 2026"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  disabled={!isUnlocked || isUploading}
                  className="w-full bg-slate-100 border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Select File (.pdf, .md, .txt)
                </label>
                <input
                  type="file"
                  accept=".pdf,.md,.txt"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  disabled={!isUnlocked || isUploading}
                  className="w-full text-xs font-bold text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-black file:bg-[#ffe17c] file:text-black file:font-black file:uppercase file:cursor-pointer hover:file:bg-white"
                />
                <span className="text-[10px] text-black/60 font-medium block mt-1">
                  PDF text extracted using serverless unpdf Mozilla engine.
                </span>
              </div>

              <button
                type="submit"
                disabled={!isUnlocked || isUploading || !selectedFile}
                className="w-full neo-btn-primary text-xs py-3 font-heading uppercase !shadow-neo disabled:opacity-50 disabled:cursor-not-allowed hover:!shadow-neo-sm"
              >
                {isUploading ? 'Chunking & Indexing...' : 'Upload & Ingest Chunks'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Notice Category
                </label>
                <select
                  value={composeCategory}
                  onChange={(e) => setComposeCategory(e.target.value)}
                  disabled={!isUnlocked || isUploading}
                  className="w-full bg-slate-100 border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none"
                >
                  <option value="Hackathons">Hackathons &amp; Events</option>
                  <option value="Project Teams">Project Teams &amp; Clubs</option>
                  <option value="Lost & Found">Lost &amp; Found</option>
                  <option value="Academics & Campus">Academics &amp; Facilities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free Midnight Pizza in Lab 3 at 1:30 PM"
                  value={composeTitle}
                  onChange={(e) => setComposeTitle(e.target.value)}
                  disabled={!isUnlocked || isUploading}
                  className="w-full bg-slate-100 border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Notice Announcement Content
                </label>
                <textarea
                  rows={5}
                  placeholder="Type official details... (Gemma 4 will answer queries about this immediately)"
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  disabled={!isUnlocked || isUploading}
                  className="w-full bg-slate-100 border-2 border-black rounded-lg p-3 text-xs font-medium text-black focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={!isUnlocked || isUploading || !composeTitle.trim() || !composeContent.trim()}
                className="w-full neo-btn-primary text-xs py-3 font-heading uppercase !shadow-neo disabled:opacity-50 disabled:cursor-not-allowed hover:!shadow-neo-sm"
              >
                {isUploading ? 'Publishing Live...' : 'Publish Notice Live to Gemma 4'}
              </button>
            </form>
          )}
        </div>

        {/* Right Table: Active Knowledge Base (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-black rounded-2xl p-6 shadow-neo space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
            <div>
              <h2 className="font-heading font-black text-xl uppercase text-black flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Active Knowledge Records
              </h2>
              <span className="text-xs text-black/70 font-bold">
                {documents.length} verified documents loaded in RAG index
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-black/50" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="bg-slate-100 text-xs pl-8 pr-3 py-1.5 rounded-lg border-2 border-black font-bold focus:outline-none w-44"
                />
              </div>
              <button
                onClick={fetchDocuments}
                className="p-1.5 rounded-lg border-2 border-black bg-[#ffe17c] hover:bg-white text-black shadow-neo-sm"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Document Cards / Table */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-black/60 font-bold text-xs">
                No matching documents found.
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border-2 border-black bg-slate-50 hover:bg-[#ffe17c]/20 transition-all shadow-neo-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm uppercase text-black">
                        {doc.title}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#b7c6c2] text-black border border-black">
                        {doc.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-black/70 font-mono font-bold">
                      <span>{doc.chunkCount} Chunks</span>
                      <span>&bull;</span>
                      <span>{doc.sourceType.toUpperCase()}</span>
                      <span>&bull;</span>
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setInspectDoc(doc)}
                      className="px-2.5 py-1 rounded bg-white text-black border-2 border-black font-heading font-black text-xs uppercase hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-neo-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                    {isUnlocked && (
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-2.5 py-1 rounded bg-red-100 text-red-700 border-2 border-black font-heading font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1 shadow-neo-sm"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Inspection Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-neo-xl overflow-hidden">
            <div className="bg-[#ffe17c] p-4 border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-black" />
                <h3 className="font-heading font-black text-lg uppercase text-black">
                  {inspectDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="w-8 h-8 rounded-lg bg-black text-white font-black flex items-center justify-center border-2 border-black"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-100 rounded-lg border-2 border-black flex items-center justify-between font-bold">
                <span>Category: {inspectDoc.category}</span>
                <span>Chunks: {inspectDoc.chunkCount}</span>
                <span>Format: {inspectDoc.sourceType}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border-2 border-black whitespace-pre-wrap leading-relaxed text-black/90">
                {inspectDoc.content}
              </div>
            </div>
            <div className="p-4 border-t-2 border-black bg-slate-100 flex justify-end">
              <button
                onClick={() => setInspectDoc(null)}
                className="neo-btn-primary text-xs py-2 px-5 !shadow-neo-sm"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
