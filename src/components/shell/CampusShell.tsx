'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Database,
  PlayCircle,
  Users,
  HelpCircle,
  Menu,
  X,
  Zap,
  ArrowLeft,
  ShieldCheck,
  Server,
  Cpu,
  Key,
} from 'lucide-react';
import { CAMPUS_FEATURES } from '@/config/features';
import { ApiKeyModal } from '@/components/ApiKeyModal';

interface CampusShellProps {
  children: React.ReactNode;
}

export function CampusShell({ children }: CampusShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [healthData, setHealthData] = useState<{
    documentCount: number;
    chunkCount: number;
    gemmaConfigured: boolean;
    backboardConfigured: boolean;
  }>({
    documentCount: 4,
    chunkCount: 12,
    gemmaConfigured: false,
    backboardConfigured: false,
  });

  const refreshHealth = () => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setHealthData({
            documentCount: data.documentCount,
            chunkCount: data.chunkCount,
            gemmaConfigured: data.gemmaConfigured,
            backboardConfigured: data.backboardConfigured,
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshHealth();
  }, [pathname]);

  // If on the root landing page, render children directly with full-width layout
  if (pathname === '/') {
    return <main className="min-h-screen bg-[#ffe17c]">{children}</main>;
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'PlayCircle':
        return <PlayCircle className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#171e19] text-black overflow-hidden font-sans selection:bg-black selection:text-[#ffe17c]">
      {/* API Key Modal Component */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSuccess={refreshHealth}
      />

      {/* Sidebar for Desktop in Neo-Brutalist Charcoal & Yellow */}
      <aside className="hidden md:flex flex-col w-80 bg-[#171e19] border-r-2 border-black justify-between z-20">
        <div>
          {/* Header & College Identity */}
          <div className="p-5 border-b-2 border-black bg-[#ffe17c]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-black text-[#ffe17c] flex items-center justify-center font-black border-2 border-black shadow-neo-sm transition-transform group-hover:rotate-6">
                <Zap className="w-6 h-6 fill-[#ffe17c]" />
              </div>
              <div>
                <h1 className="font-heading font-black text-lg leading-tight uppercase tracking-tight text-black flex items-center gap-1.5">
                  Campus Hub
                  <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-black text-[#ffe17c] border border-black">
                    PIT
                  </span>
                </h1>
                <p className="text-xs font-bold text-black/70">
                  Prasad Inst. of Technology
                </p>
              </div>
            </Link>

            {/* Back to Landing Page Link */}
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:underline underline-offset-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Landing Page
              </Link>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#b7c6c2] text-black border border-black">
                24 Oct 2026
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <div className="px-3 py-1 text-[11px] font-black tracking-widest text-[#b7c6c2] uppercase">
              Application Modules
            </div>

            {CAMPUS_FEATURES.map((feature) => {
              const isActive = pathname === feature.href;
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold border-2 border-black transition-all ${
                    isActive
                      ? 'bg-[#ffe17c] text-black shadow-neo translate-x-1'
                      : 'bg-white text-black hover:bg-[#b7c6c2] hover:shadow-neo-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-black">{getIcon(feature.iconName)}</span>
                    <span className="font-heading font-black tracking-tight uppercase">
                      {feature.name}
                    </span>
                  </div>
                  {feature.badge && (
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${
                        isActive
                          ? 'bg-black text-[#ffe17c]'
                          : 'bg-[#ffe17c] text-black'
                      }`}
                    >
                      {feature.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* API Key Connect Button & System Status */}
        <div className="p-4 border-t-2 border-black bg-[#272727] space-y-3 text-xs">
          {/* Prominent API Key Connect Button */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#ffe17c] hover:bg-white text-black border-2 border-black font-heading font-black uppercase text-xs shadow-neo hover:shadow-neo-sm transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4 fill-black" />
              {healthData.gemmaConfigured ? 'Gemma 4 Live' : 'Connect Gemma 4'}
            </span>
            <span
              className={`w-3 h-3 rounded-full border border-black ${
                healthData.gemmaConfigured ? 'bg-emerald-600' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </button>

          <div className="p-3 rounded-xl bg-[#171e19] border-2 border-black space-y-2 text-white shadow-neo-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-gray-200">
                <Cpu className="w-4 h-4 text-[#ffe17c]" />
                Inference Backbone
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ffe17c] text-black border border-black">
                {healthData.gemmaConfigured ? 'Live Gemma 4' : 'Local Grounded'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-gray-200">
                <ShieldCheck className="w-4 h-4 text-[#b7c6c2]" />
                Grounded Records
              </span>
              <span className="text-[11px] text-white font-mono font-bold">
                {healthData.documentCount} docs / {healthData.chunkCount} chunks
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-gray-200">
                <Server className="w-4 h-4 text-emerald-400" />
                SSD Confinement
              </span>
              <span className="text-[11px] font-mono font-black text-[#ffe17c]">
                D:\anurag
              </span>
            </div>
          </div>

          <div className="text-[11px] font-bold text-gray-300 text-center flex items-center justify-center gap-2">
            <span>$0 Free Stack</span>
            <span>•</span>
            <span className="text-[#ffe17c]">MIT Open Source</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        {/* Mobile Header in Neo-Brutalist Yellow */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#ffe17c] border-b-2 border-black">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-[#ffe17c] flex items-center justify-center font-black border-2 border-black">
              <Zap className="w-5 h-5 fill-[#ffe17c]" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-black uppercase text-black">
                Campus Hub
              </h2>
              <p className="text-[10px] font-bold text-black/70">
                PIT Jaunpur Hack Day
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-black text-[#ffe17c] border-2 border-black text-xs font-black uppercase shadow-neo-sm"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-black text-[#ffe17c] border-2 border-black shadow-neo-sm"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#171e19] border-b-2 border-black p-4 space-y-2 z-30 shadow-neo-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-bold bg-[#ffe17c] text-black border-2 border-black mb-2"
            >
              <span>← Back to Landing Page</span>
            </Link>
            {CAMPUS_FEATURES.map((feature) => (
              <Link
                key={feature.id}
                href={feature.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg text-sm font-bold bg-white text-black border-2 border-black hover:bg-[#b7c6c2]"
              >
                <div className="flex items-center gap-2.5">
                  {getIcon(feature.iconName)}
                  <span className="font-heading uppercase">{feature.name}</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ffe17c] text-black border border-black">
                  {feature.badge}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Children Page Viewport */}
        <main className="flex-1 overflow-y-auto relative bg-[#ffe17c]/15">
          {children}
        </main>
      </div>
    </div>
  );
}
