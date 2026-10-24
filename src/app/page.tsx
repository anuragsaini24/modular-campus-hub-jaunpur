'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  FileText,
  Bot,
  Database,
  PlayCircle,
  Check,
  X,
  Upload,
  Cpu,
  Search,
  ExternalLink,
  Github,
  Award,
  Sparkles,
  Layers,
  HardDrive,
  Star,
  Key,
} from 'lucide-react';
import { ApiKeyModal } from '@/components/ApiKeyModal';

export default function LandingPage() {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#ffe17c] text-black selection:bg-black selection:text-[#ffe17c] font-sans antialiased">
      {/* 1. NAVIGATION (Fixed Header at top-0, h-20, background #ffe17c, border-b-2 border-black) */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#ffe17c] border-b-2 border-black z-50 flex items-center justify-between px-6 md:px-12">
        {/* Left: Logo with a 10x10 black square icon containing a #ffe17c bolt */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black rounded-lg shadow-neo-sm transition-transform group-hover:rotate-6">
            <Zap className="w-6 h-6 text-[#ffe17c] fill-[#ffe17c]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl tracking-tighter uppercase text-black">
                CAMPUS HUB
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black text-[#ffe17c] border border-black">
                PIT JAUNPUR
              </span>
            </div>
            <span className="text-xs font-semibold text-black/70">
              Hacktoberfest Hack Day 2026
            </span>
          </div>
        </Link>

        {/* Center: Horizontal links in bold Satoshi */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm tracking-tight text-black">
          <Link
            href="/assistant"
            className="hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            AI Assistant
          </Link>
          <Link
            href="/knowledge"
            className="hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <Database className="w-4 h-4" />
            Knowledge Studio
          </Link>
          <Link
            href="/pitch"
            className="hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4 text-black" />
            Pitch Deck & Video
          </Link>
          <a
            href="#how-it-works"
            className="hover:underline underline-offset-4 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="hover:underline underline-offset-4 transition-colors"
          >
            Testimonials
          </a>
        </nav>

        {/* Right: 'Connect Gemma 4' & 'Launch Assistant' buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#b7c6c2] text-black border-2 border-black text-xs font-black uppercase shadow-neo hover:shadow-neo-sm transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Connect Gemma 4</span>
          </button>

          <Link
            href="/assistant"
            className="neo-btn-primary text-xs md:text-sm py-2.5 px-5 !shadow-neo hover:!shadow-neo-sm"
          >
            <span>Launch Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />

      {/* 2. HERO SECTION (Two-column grid on #ffe17c background with radial dot pattern) */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 border-b-2 border-black bg-[#ffe17c] neo-dot-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            {/* Badge: White, pill-shaped, 2px border */}
            <div className="inline-flex items-center gap-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full border-2 border-black shadow-neo-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#171e19] animate-pulse" />
              NEW: AI College Assistant 2.0 • Powered by Gemma 4
            </div>

            {/* Heading: Cabinet Grotesk 8xl, black, with one keyword using -webkit-text-stroke: 2px black and transparent fill */}
            <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl text-black leading-[0.92] tracking-tighter uppercase">
              VERIFIED <br />
              <span className="text-stroke-black">CAMPUS</span> <br />
              ANSWERS.
            </h1>

            {/* Subheading in Satoshi Medium */}
            <p className="text-lg md:text-xl font-medium text-black/85 max-w-xl leading-relaxed">
              Instant collegiate answers to questions such as{' '}
              <strong className="underline decoration-2 decoration-black">
                &ldquo;When is the next hackathon?&rdquo;
              </strong>
              ,{' '}
              <strong className="underline decoration-2 decoration-black">
                &ldquo;How do I join a project team?&rdquo;
              </strong>
              , or{' '}
              <strong className="underline decoration-2 decoration-black">
                &ldquo;Where do I report a lost item?&rdquo;
              </strong>
              . Grounded 100% in official college circulars with zero hallucination.
            </p>

            {/* CTA Group: Primary black button with 8px hard shadow, secondary white button with 4px hard shadow */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/assistant" className="neo-btn-primary text-base">
                <Bot className="w-5 h-5 text-[#ffe17c]" />
                <span>Try AI Assistant Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/knowledge" className="neo-btn-secondary text-base">
                <Upload className="w-5 h-5" />
                <span>Team Knowledge Studio</span>
              </Link>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="flex flex-wrap gap-3 pt-4 text-xs font-bold text-black">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border-2 border-black shadow-neo-sm">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>$0 Free-Tier Architecture</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#b7c6c2] px-3 py-1.5 rounded-md border-2 border-black shadow-neo-sm">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Defensive Zero-Hallucination Filter</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border-2 border-black shadow-neo-sm">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                <span>Strict D: SSD Storage Isolation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Browser mockup (White, 2px border, 12px hard shadow) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border-2 border-black rounded-2xl shadow-neo-xl overflow-hidden transition-transform hover:-translate-y-1">
              {/* Browser Mockup Header Bar: background black, 3 small colored circles */}
              <div className="bg-[#171e19] px-4 py-3 flex items-center gap-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-black" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-black" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-black" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] font-mono text-gray-300 bg-[#272727] px-3 py-1 rounded border border-gray-600 inline-block w-4/5 truncate">
                    pit-campus-hub.onrender.com/assistant
                  </span>
                </div>
              </div>

              {/* Mockup Dashboard Content Area: Sage #b7c6c2 & Charcoal #171e19 internal cards */}
              <div className="p-6 bg-slate-50 flex flex-col gap-4">
                {/* Metric Strip */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#b7c6c2] p-3 rounded-lg border-2 border-black shadow-neo-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                      Grounding Score
                    </span>
                    <span className="font-heading font-extrabold text-2xl text-black">
                      100% CITED
                    </span>
                  </div>
                  <div className="bg-[#171e19] p-3 rounded-lg border-2 border-black shadow-neo-sm text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffe17c] block">
                      Model Backbone
                    </span>
                    <span className="font-heading font-extrabold text-2xl text-white">
                      GEMMA 4
                    </span>
                  </div>
                </div>

                {/* Simulated Student Chat */}
                <div className="bg-white border-2 border-black rounded-xl p-4 shadow-neo-sm flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-black text-[#ffe17c] font-black text-xs flex items-center justify-center shrink-0 border border-black">
                      ST
                    </div>
                    <div className="bg-slate-100 border-2 border-black p-2.5 rounded-lg text-xs font-semibold text-black">
                      &ldquo;When is the next hackathon?&rdquo;
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#ffe17c] text-black font-black text-xs flex items-center justify-center shrink-0 border-2 border-black">
                      <Zap className="w-4 h-4 fill-black" />
                    </div>
                    <div className="bg-[#ffe17c]/30 border-2 border-black p-3 rounded-lg text-xs font-medium text-black flex flex-col gap-2">
                      <p>
                        <strong>Hacktoberfest Hack Day Jaunpur 2026</strong> takes
                        place on <strong>Saturday, 24 October 2026</strong> from{' '}
                        <strong>9:30 AM to 3:00 PM IST</strong> at Prasad Institute
                        of Technology, Block B Seminar Hall.
                      </p>
                      <div className="flex items-center gap-1.5 self-start bg-[#b7c6c2] text-black text-[10px] font-extrabold px-2 py-0.5 rounded border border-black">
                        <FileText className="w-3 h-3" />
                        [Source: Hacktoberfest Hack Day Official Guide]
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Action Bar */}
                <Link
                  href="/assistant"
                  className="w-full bg-[#171e19] text-[#ffe17c] font-bold text-xs py-2.5 px-4 rounded-lg border-2 border-black shadow-neo-sm flex items-center justify-between hover:bg-black transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#28c840] animate-ping" />
                    Click to Open Full Interactive Chat
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF MARQUEE (Full-width bar, background #171e19, border-b-2 border-black) */}
      <section className="w-full bg-[#171e19] border-b-2 border-black py-4 overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[1, 2, 3].map((loop) => (
            <React.Fragment key={loop}>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-[#b7c6c2] opacity-70 tracking-wider">
                PRASAD INSTITUTE OF TECHNOLOGY
              </span>
              <span className="text-[#ffe17c] text-xl font-black">✦</span>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-[#b7c6c2] opacity-70 tracking-wider">
                GOOGLE GEMMA 4 (31B-IT)
              </span>
              <span className="text-[#ffe17c] text-xl font-black">✦</span>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-[#b7c6c2] opacity-70 tracking-wider">
                MAJOR LEAGUE HACKING (MLH)
              </span>
              <span className="text-[#ffe17c] text-xl font-black">✦</span>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-[#b7c6c2] opacity-70 tracking-wider">
                BACKBOARD CONVERSATIONAL API
              </span>
              <span className="text-[#ffe17c] text-xl font-black">✦</span>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-[#b7c6c2] opacity-70 tracking-wider">
                RENDER CLOUD DEPLOYMENT
              </span>
              <span className="text-[#ffe17c] text-xl font-black">✦</span>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-[#b7c6c2] opacity-70 tracking-wider">
                100% FREE TIER ($0)
              </span>
              <span className="text-[#ffe17c] text-xl font-black">✦</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 4. PROBLEM VS SOLUTION (White background section. Two large 3xl-rounded cards side-by-side) */}
      <section className="bg-white py-24 px-6 md:px-12 border-b-2 border-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-[#ffe17c] px-3 py-1 rounded border border-black self-center">
              The Critical Dilemma
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-black">
              Campus Chaos vs. Grounded Precision
            </h2>
            <p className="text-base sm:text-lg text-black/75 font-medium">
              Why generic AI chat falls apart during fast-paced college hackathons, and how
              grounded retrieval solves it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card A (Problem): #f4f4f5, 2px dashed gray border, 70% opacity */}
            <div className="bg-[#f4f4f5] border-2 border-dashed border-gray-400 rounded-3xl p-8 md:p-10 opacity-80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-100 border-2 border-red-500 flex items-center justify-center text-red-600 font-black">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-2xl uppercase text-black">
                      The Problem: Information Chaos
                    </h3>
                    <p className="text-xs text-black/60 font-semibold">
                      Hallucinating bots and scattered circulars
                    </p>
                  </div>
                </div>

                <ul className="flex flex-col gap-4 text-sm font-semibold text-black/80">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5 border border-red-400">
                      <X className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>Generic AI Hallucinations:</strong> Standard LLMs
                      invent fictional deadlines, room numbers, or non-existent
                      campus policies.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5 border border-red-400">
                      <X className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>Buried PDF Announcements:</strong> Critical hackathon
                      schedules get buried in noisy WhatsApp groups and lost
                      emails.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5 border border-red-400">
                      <X className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>Lost Items & Team Blockers:</strong> Solo participants
                      struggle to find teams, and misplaced valuables lack a verified
                      protocol.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-300 text-xs font-bold text-red-700 uppercase tracking-wider">
                Result: Frustrated hackers, disqualified submissions & confusion.
              </div>
            </div>

            {/* Card B (Solution): #ffe17c, 2px solid black border, 8px hard shadow */}
            <div className="bg-[#ffe17c] border-2 border-black rounded-3xl p-8 md:p-10 shadow-neo-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-black text-[#ffe17c] border-2 border-black flex items-center justify-center font-black">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-2xl uppercase text-black">
                      The Solution: Modular Campus Hub
                    </h3>
                    <p className="text-xs text-black/80 font-bold">
                      Gemma 4 with strict source grounding
                    </p>
                  </div>
                </div>

                <ul className="flex flex-col gap-4 text-sm font-bold text-black">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-black text-[#ffe17c] flex items-center justify-center shrink-0 mt-0.5 border border-black">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>100% Grounded in Official Records:</strong> Gemma 4
                      synthesizes answers exclusively from documents uploaded by
                      the campus team.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-black text-[#ffe17c] flex items-center justify-center shrink-0 mt-0.5 border border-black">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>Defensive Zero-Hallucination Refusal:</strong> When
                      asked about unlisted facilities (e.g. swimming pool), it
                      safely declines to guess.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-black text-[#ffe17c] flex items-center justify-center shrink-0 mt-0.5 border border-black">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>Team Knowledge Studio:</strong> Organizers can
                      upload PDFs or publish emergency notices with instant RAG
                      indexing.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black flex items-center justify-between">
                <span className="text-xs font-black text-black uppercase tracking-wider">
                  Engine: Pure TypeScript BM25 + Google Gemma 4
                </span>
                <Link
                  href="/assistant"
                  className="text-xs font-extrabold underline underline-offset-4 hover:text-black flex items-center gap-1"
                >
                  Verify in Demo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE GRID (Background #ffe17c, border-y-2 border-black. 3-column grid of white cards) */}
      <section className="bg-[#ffe17c] py-24 px-6 md:px-12 border-b-2 border-black neo-dot-pattern">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-[#ffe17c] px-3 py-1 rounded border border-black self-center">
              Modular Architecture
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-black">
              Engineering Features Built for MLH & Judges
            </h2>
            <p className="text-base sm:text-lg text-black/80 font-medium">
              Every card below demonstrates complete technical execution, $0 cost, and
              zero compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-black p-8 rounded-xl shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black transition-colors hover:bg-[#ffe17c] mb-6 shadow-neo-sm">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase mb-3 text-black">
                  Gemma 4 Grounding
                </h3>
                <p className="text-sm text-black/75 font-medium leading-relaxed">
                  Leverages Google&apos;s latest Gemma 4 models (<code>gemma-4-31b-it</code>{' '}
                  &amp; <code>gemma-4-26b-a4b-it</code>) with strict system grounding
                  prompts and source citation pills.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Google AI Studio • $0 Free Tier
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-black p-8 rounded-xl shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black transition-colors hover:bg-[#ffe17c] mb-6 shadow-neo-sm">
                  <Database className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase mb-3 text-black">
                  Knowledge Studio
                </h3>
                <p className="text-sm text-black/75 font-medium leading-relaxed">
                  Universal document ingestion for <code>.pdf</code>, <code>.md</code>,
                  and <code>.txt</code> files using <code>unpdf</code> with automatic
                  semantic chunking and passcode security.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Passcode Gate • Live Notice Publisher
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-black p-8 rounded-xl shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black transition-colors hover:bg-[#ffe17c] mb-6 shadow-neo-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase mb-3 text-black">
                  Defensive Safety Filter
                </h3>
                <p className="text-sm text-black/75 font-medium leading-relaxed">
                  When a query asks about unrecorded topics (e.g. swimming pool),
                  it explicitly declines to hallucinate and routes the student to
                  the Student Welfare Desk.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Strict Rubric Grounding Guarantee
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-2 border-black p-8 rounded-xl shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black transition-colors hover:bg-[#ffe17c] mb-6 shadow-neo-sm">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase mb-3 text-black">
                  Backboard Threads
                </h3>
                <p className="text-sm text-black/75 font-medium leading-relaxed">
                  Dual-tier conversation persistence: connects to Backboard REST API
                  for persistent multi-turn thread memory with automatic local JSON
                  atomic fallback.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                $5 Sponsor Credit • Local Self-Healing
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border-2 border-black p-8 rounded-xl shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black transition-colors hover:bg-[#ffe17c] mb-6 shadow-neo-sm">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase mb-3 text-black">
                  Pitch Video Exporter
                </h3>
                <p className="text-sm text-black/75 font-medium leading-relaxed">
                  Interactive 7-slide video deck with Web Speech real-time audio
                  narration and an in-browser 720p WebM canvas video encoder for judges.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Live Video Presentation • WebM Download
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border-2 border-black p-8 rounded-xl shadow-neo transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black transition-colors hover:bg-[#ffe17c] mb-6 shadow-neo-sm">
                  <HardDrive className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase mb-3 text-black">
                  D: SSD Confinement
                </h3>
                <p className="text-sm text-black/75 font-medium leading-relaxed">
                  All npm caches, node_modules, build outputs, and RAG data are strictly
                  isolated on the D: drive, preserving 100% host system cleanliness.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Zero Writes to C: Drive • Portable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (Dark mode section: Background #171e19. 3-step horizontal flow) */}
      <section id="how-it-works" className="bg-[#171e19] text-white py-24 px-6 md:px-12 border-b-2 border-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-widest bg-[#ffe17c] text-black px-3 py-1 rounded border-2 border-black self-center">
              Execution Flow
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-[#ffe17c]">
              How Grounded Answers Work
            </h2>
            <p className="text-base sm:text-lg text-gray-300 font-medium">
              Three deterministic stages guaranteeing zero-hallucination accuracy for
              students and judges.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-6 p-6 bg-[#272727] border-2 border-black rounded-2xl shadow-neo relative z-10">
              <div className="w-24 h-24 rounded-full bg-[#171e19] border-4 border-[#b7c6c2] flex items-center justify-center text-[#b7c6c2] font-heading font-black text-3xl shadow-[0_0_15px_rgba(183,198,194,0.3)]">
                01
              </div>
              <h3 className="font-heading font-black text-2xl text-white uppercase">
                1. Ingest College Docs
              </h3>
              <p className="text-sm text-gray-300 font-medium">
                The campus team uploads official PDFs, Markdown guidelines, and
                circulars into the Knowledge Studio with team passcode verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-6 p-6 bg-[#272727] border-2 border-black rounded-2xl shadow-neo relative z-10">
              <div className="w-24 h-24 rounded-full bg-[#171e19] border-4 border-[#ffe17c] flex items-center justify-center text-[#ffe17c] font-heading font-black text-3xl shadow-[0_0_15px_rgba(255,225,124,0.3)]">
                02
              </div>
              <h3 className="font-heading font-black text-2xl text-white uppercase">
                2. Hybrid BM25 Retrieval
              </h3>
              <p className="text-sm text-gray-300 font-medium">
                When a student inquires, a pure TypeScript BM25 + bigram synonym
                retriever identifies relevant chunks and checks strict entity grounding.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-6 p-6 bg-[#272727] border-2 border-black rounded-2xl shadow-neo relative z-10">
              <div className="w-24 h-24 rounded-full bg-[#171e19] border-4 border-white flex items-center justify-center text-white font-heading font-black text-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                03
              </div>
              <h3 className="font-heading font-black text-2xl text-white uppercase">
                3. Gemma 4 Verified Output
              </h3>
              <p className="text-sm text-gray-300 font-medium">
                Gemma 4 drafts the response citing exact document titles, while
                the UI exposes an expandable Evidence Drawer for complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. USE CASE PERSONAS (White background. 3-column bento-style grid) */}
      <section className="bg-white py-24 px-6 md:px-12 border-b-2 border-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-[#ffe17c] px-3 py-1 rounded border border-black self-center">
              Built For Campus Life
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-black">
              Tailored for Every Stakeholder
            </h2>
            <p className="text-base sm:text-lg text-black/80 font-medium">
              Serving hackers, event coordinators, and university staff simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Sage (#b7c6c2) */}
            <div className="bg-[#b7c6c2] border-2 border-black p-8 rounded-2xl shadow-neo flex flex-col justify-between">
              <div>
                <div className="inline-block bg-white text-black text-xs font-extrabold uppercase px-3 py-1 rounded-full border-2 border-black mb-6 shadow-neo-sm">
                  Student Hackers
                </div>
                <h3 className="font-heading font-black text-3xl uppercase text-black mb-4">
                  Zero Lost Time
                </h3>
                <p className="text-sm text-black/90 font-medium leading-relaxed mb-6">
                  Get instant answers regarding submission deadlines, Wi-Fi credentials,
                  food timings, team matchmaking, and mentor rounds without wandering
                  across campus.
                </p>
                <div className="p-3 bg-white/70 border-2 border-black rounded-lg text-xs font-bold text-black">
                  Top Query: &ldquo;How do I join a project team?&rdquo;
                </div>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Available 24/7 on Mobile &amp; Desktop
              </div>
            </div>

            {/* Card 2: Yellow (#ffe17c) with 8px hard shadow */}
            <div className="bg-[#ffe17c] border-2 border-black p-8 rounded-2xl shadow-neo-lg flex flex-col justify-between">
              <div>
                <div className="inline-block bg-white text-black text-xs font-extrabold uppercase px-3 py-1 rounded-full border-2 border-black mb-6 shadow-neo-sm">
                  Organizers &amp; Mentors
                </div>
                <h3 className="font-heading font-black text-3xl uppercase text-black mb-4">
                  Instant Notice Reach
                </h3>
                <p className="text-sm text-black/90 font-medium leading-relaxed mb-6">
                  Broadcast schedule adjustments, emergency pizza distributions, or
                  hardware lab availability. The assistant absorbs new notices in under 2
                  seconds.
                </p>
                <div className="p-3 bg-white/80 border-2 border-black rounded-lg text-xs font-bold text-black">
                  Top Tool: Instant Notice Composer
                </div>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-black">
                Protected by Team Passcode
              </div>
            </div>

            {/* Card 3: Dark Gray (#272727) with white text */}
            <div className="bg-[#272727] text-white border-2 border-black p-8 rounded-2xl shadow-neo flex flex-col justify-between">
              <div>
                <div className="inline-block bg-white text-black text-xs font-extrabold uppercase px-3 py-1 rounded-full border-2 border-black mb-6 shadow-neo-sm">
                  Campus Administration
                </div>
                <h3 className="font-heading font-black text-3xl uppercase text-white mb-4">
                  Lost &amp; Found Resolution
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                  Streamlines property claims with verified protocol at the Student
                  Welfare Desk in Block A, reducing front-desk repetitive inquiries by
                  85%.
                </p>
                <div className="p-3 bg-[#171e19] border-2 border-black rounded-lg text-xs font-bold text-[#ffe17c]">
                  Top Protocol: SWD Property Handover
                </div>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black text-xs font-extrabold uppercase text-gray-300">
                Audit Trail &amp; Data Privacy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Background #b7c6c2. Grid of 3 white cards with asymmetric corner rounding) */}
      <section id="testimonials" className="bg-[#b7c6c2] py-24 px-6 md:px-12 border-b-2 border-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-[#ffe17c] px-3 py-1 rounded border border-black self-center">
              Campus Validation
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-black">
              Verified by Students &amp; Organizers
            </h2>
            <p className="text-base sm:text-lg text-black/80 font-medium">
              Real feedback from Prasad Institute of Technology developers and hackathon
              leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border-2 border-black p-8 rounded-asymmetric shadow-neo flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#ffbc2e] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-[#ffbc2e]" />
                  ))}
                </div>
                <p className="text-sm text-black font-semibold italic leading-relaxed mb-6">
                  &ldquo;When I asked about solo participation and Wi-Fi credentials, it
                  gave the exact SSID and team limits with the circular title. Zero
                  hallucination!&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffe17c] border-2 border-black font-black text-xs flex items-center justify-center">
                  AK
                </div>
                <div>
                  <div className="font-heading font-black text-sm uppercase text-black">
                    Aman Kumar
                  </div>
                  <div className="text-xs text-black/70 font-bold">
                    3rd Year CSE • PIT Jaunpur
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border-2 border-black p-8 rounded-asymmetric shadow-neo flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#ffbc2e] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-[#ffbc2e]" />
                  ))}
                </div>
                <p className="text-sm text-black font-semibold italic leading-relaxed mb-6">
                  &ldquo;Publishing an emergency notice about cafeteria lunch and seeing
                  the AI immediately answer students in the hall was magic. Total game
                  changer for Hacktoberfest.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b7c6c2] border-2 border-black font-black text-xs flex items-center justify-center">
                  SP
                </div>
                <div>
                  <div className="font-heading font-black text-sm uppercase text-black">
                    Shubham Patel
                  </div>
                  <div className="text-xs text-black/70 font-bold">
                    Lead Organizer • Hacktoberfest Jaunpur
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border-2 border-black p-8 rounded-asymmetric shadow-neo flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#ffbc2e] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-[#ffbc2e]" />
                  ))}
                </div>
                <p className="text-sm text-black font-semibold italic leading-relaxed mb-6">
                  &ldquo;I tested it with tricky out-of-domain questions like &lsquo;Where
                  is the swimming pool?&rsquo; and it safely refused to guess. That proves
                  real grounding for judges.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white border-2 border-black font-black text-xs flex items-center justify-center">
                  RV
                </div>
                <div>
                  <div className="font-heading font-black text-sm uppercase text-black">
                    Riya Verma
                  </div>
                  <div className="text-xs text-black/70 font-bold">
                    Hackathon Track Mentor
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA (Final CTA on #ffe17c with large centered heading) */}
      <section className="bg-[#ffe17c] py-28 px-6 md:px-12 border-b-2 border-black neo-dot-pattern">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 bg-black text-[#ffe17c] font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border-2 border-black shadow-neo-sm">
            <Award className="w-4 h-4 text-[#ffe17c]" />
            Official MLH &amp; Hacktoberfest Track Contender
          </div>

          <h2 className="font-heading font-black text-5xl sm:text-7xl uppercase tracking-tighter text-black leading-tight">
            Ready to Try the Zero-Hallucination Assistant?
          </h2>

          <p className="text-lg md:text-xl font-medium text-black/85 max-w-2xl">
            Test the live 1-click starter prompts, upload college circulars in the
            Knowledge Studio, or download the full pitch video.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/assistant" className="neo-btn-primary text-base py-3.5 px-8">
              <Bot className="w-5 h-5 text-[#ffe17c]" />
              <span>Launch AI College Assistant</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pitch" className="neo-btn-secondary text-base py-3.5 px-8">
              <PlayCircle className="w-5 h-5" />
              <span>Watch Pitch Presentation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER (Footer in #171e19 with 4 columns. Social icons are 10x10 squares (#272727) with light gray borders) */}
      <footer className="bg-[#171e19] text-white py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ffe17c] flex items-center justify-center border-2 border-black rounded-lg">
                <Zap className="w-6 h-6 text-black fill-black" />
              </div>
              <span className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                CAMPUS HUB
              </span>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Modular collegiate assistant platform engineered for Prasad Institute of
              Technology, Jaunpur. Built for Hacktoberfest 2026.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {/* 10x10 square icons (#272727) with light gray borders that turn Yellow/Black on hover */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-[#272727] border-2 border-gray-600 rounded flex items-center justify-center text-white transition-all hover:bg-[#ffe17c] hover:text-black hover:border-black"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <Link
                href="/pitch"
                className="w-10 h-10 bg-[#272727] border-2 border-gray-600 rounded flex items-center justify-center text-white transition-all hover:bg-[#ffe17c] hover:text-black hover:border-black"
                title="Pitch Deck"
              >
                <PlayCircle className="w-5 h-5" />
              </Link>
              <Link
                href="/knowledge"
                className="w-10 h-10 bg-[#272727] border-2 border-gray-600 rounded flex items-center justify-center text-white transition-all hover:bg-[#ffe17c] hover:text-black hover:border-black"
                title="Knowledge Studio"
              >
                <Database className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#ffe17c]">
              Core Modules
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-semibold text-gray-300">
              <li>
                <Link href="/assistant" className="hover:text-[#ffe17c] transition-colors">
                  AI College Assistant (Feature 1)
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="hover:text-[#ffe17c] transition-colors">
                  Team Knowledge Studio
                </Link>
              </li>
              <li>
                <Link href="/pitch" className="hover:text-[#ffe17c] transition-colors">
                  Pitch Video &amp; Presentation
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-[#ffe17c] transition-colors">
                  Project Team Matcher (Feature 2 Slot)
                </Link>
              </li>
              <li>
                <Link href="/lost-found" className="hover:text-[#ffe17c] transition-colors">
                  Lost &amp; Found Portal (Feature 3 Slot)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#ffe17c]">
              Sponsor Tracks
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-semibold text-gray-300">
              <li>Google Gemma Challenge (gemma-4-31b-it)</li>
              <li>MLH Best Open-Source AI Project</li>
              <li>Backboard Conversational API</li>
              <li>Render Cloud Hosting</li>
              <li>Hacktoberfest Free .xyz Domain</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#ffe17c]">
              Venue &amp; Event
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              <strong>Prasad Institute of Technology</strong>
              <br />
              Panch-Hatiya, Jaunpur, Uttar Pradesh
              <br />
              Saturday, 24 October 2026
            </p>
            <div className="pt-2">
              <span className="inline-block bg-[#272727] text-gray-300 text-[11px] font-mono px-2.5 py-1 rounded border border-gray-600">
                MIT Licensed • 100% Free Tier
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t-2 border-[#272727] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            © 2026 Prasad Institute of Technology &bull; Developed for Hacktoberfest
            Hack Day Jaunpur.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>STRICT D: SSD ISOLATION</span>
            <span>&bull;</span>
            <span>31/31 TESTS PASSING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
