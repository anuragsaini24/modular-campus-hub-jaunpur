'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Cpu,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onSuccess }: ApiKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [backboardKey, setBackboardKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showBackboardKey, setShowBackboardKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusData, setStatusData] = useState<{
    gemmaConfigured: boolean;
    gemmaKeyMasked: string | null;
    backboardConfigured: boolean;
    backboardKeyMasked: string | null;
    activeModel: string;
  } | null>(null);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const loadStatus = () => {
    fetch('/api/settings/key')
      .then((res) => res.json())
      .then((data) => setStatusData(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      setFeedback({ type: null, message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setFeedback({ type: null, message: '' });

    try {
      const res = await fetch('/api/settings/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: geminiKey,
          backboardApiKey: backboardKey,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'Key saved successfully!',
        });
        loadStatus();
        setGeminiKey('');
        setBackboardKey('');
        if (onSuccess) onSuccess();
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to verify API key.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Network error connecting to API.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-2xl max-w-xl w-full shadow-neo-xl overflow-hidden flex flex-col font-sans">
        {/* Header Bar */}
        <div className="bg-[#ffe17c] p-5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-[#ffe17c] flex items-center justify-center font-black border-2 border-black shadow-neo-sm">
              <Zap className="w-6 h-6 fill-[#ffe17c]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl uppercase tracking-tight text-black">
                Connect Real API Keys
              </h3>
              <p className="text-xs font-bold text-black/70">
                Google Gemma 4 &amp; Backboard Cloud Setup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-black text-white hover:bg-red-600 font-black flex items-center justify-center border-2 border-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Current Live Status Box */}
          <div className="p-4 rounded-xl bg-slate-50 border-2 border-black space-y-2 text-xs">
            <div className="font-heading font-black uppercase text-black flex items-center justify-between">
              <span>Current Inference Status:</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ffe17c] border border-black">
                {statusData?.gemmaConfigured ? 'LIVE NEURAL' : 'LOCAL GROUNDED ($0)'}
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-black/80 font-medium">
              <div className="flex items-center justify-between">
                <span>Google Gemma 4:</span>
                <span className="font-mono font-bold text-black">
                  {statusData?.gemmaConfigured
                    ? `✓ Active (${statusData.gemmaKeyMasked})`
                    : 'Local Grounded Engine Active (Works Offline)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Backboard Sync:</span>
                <span className="font-mono font-bold text-black">
                  {statusData?.backboardConfigured
                    ? `✓ Active (${statusData.backboardKeyMasked})`
                    : 'Local JSON Store Active ($0 Forever)'}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback.message && (
            <div
              className={`p-3.5 rounded-xl border-2 border-black text-xs font-bold flex items-center gap-2 shadow-neo-sm ${
                feedback.type === 'success'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-red-100 text-red-900'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveAndTest} className="space-y-5">
            {/* Google AI Studio Key Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-black uppercase tracking-tight text-black flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-black" />
                  Google AI Studio API Key (Free Tier)
                </label>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-black font-extrabold underline underline-offset-2 flex items-center gap-1 text-[11px] hover:text-black/70"
                >
                  <span>Get 100% Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  placeholder={
                    statusData?.gemmaConfigured
                      ? 'Key is saved. Paste new key to update...'
                      : 'AIzaSy...'
                  }
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-slate-100 text-black font-mono text-xs rounded-xl px-3.5 py-3 pr-10 border-2 border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-3 text-black/50 hover:text-black"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-black/70 font-semibold">
                Powers real-time Google Gemma 4 (<code>gemma-4-31b-it</code>) reasoning over college circulars.
              </p>
            </div>

            {/* Backboard API Key Input (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-black uppercase tracking-tight text-black flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-black" />
                  Backboard API Key (Optional Track)
                </label>
                <a
                  href="https://app.backboard.io/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-black font-extrabold underline underline-offset-2 flex items-center gap-1 text-[11px] hover:text-black/70"
                >
                  <span>Get $5 Free Credit</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showBackboardKey ? 'text' : 'password'}
                  placeholder={
                    statusData?.backboardConfigured
                      ? 'Backboard key is saved. Paste to update...'
                      : 'bb_...'
                  }
                  value={backboardKey}
                  onChange={(e) => setBackboardKey(e.target.value)}
                  className="w-full bg-slate-100 text-black font-mono text-xs rounded-xl px-3.5 py-3 pr-10 border-2 border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowBackboardKey(!showBackboardKey)}
                  className="absolute right-3 top-3 text-black/50 hover:text-black"
                >
                  {showBackboardKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-black/70 font-semibold">
                Syncs multi-turn threads to Backboard cloud infrastructure for the Hacktoberfest DEV track.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="neo-btn-secondary text-xs py-2.5 px-4 !shadow-neo-sm font-heading uppercase"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isTesting || (!geminiKey.trim() && !backboardKey.trim())}
                className="neo-btn-primary text-xs py-2.5 px-6 !shadow-neo font-heading uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:!shadow-neo-sm"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#ffe17c]" />
                    <span>Verifying Key...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#ffe17c]" />
                    <span>Save &amp; Test Connection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
