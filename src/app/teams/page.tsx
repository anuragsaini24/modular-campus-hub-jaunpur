import React from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, Bot, GitBranch, Zap, Sparkles } from 'lucide-react';

export default function TeamsPage() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
        <Link href="/assistant" className="hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to AI Assistant
        </Link>
        <span>/</span>
        <span className="text-black/60">Feature 2 Slot</span>
      </div>

      <div className="p-8 rounded-2xl bg-white border-2 border-black shadow-neo-lg space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-xl bg-[#ffe17c] border-2 border-black flex items-center justify-center text-black shadow-neo-sm">
            <Users className="w-7 h-7" />
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#b7c6c2] text-black border-2 border-black font-heading font-black uppercase shadow-neo-sm">
            Feature 2 Slot
          </span>
        </div>

        <div>
          <h1 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tight text-black">
            Smart Project Team Matcher
          </h1>
          <p className="text-sm font-semibold text-black/80 mt-2 leading-relaxed">
            Reserved extension slot for Feature 2. Solo hackathon participants can
            register their tech stacks (Next.js, Gemma 4, Python, Hardware, Figma) and
            receive algorithmic teammate suggestions matching PIT Jaunpur guidelines (1
            to 4 members).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#ffe17c]/30 border-2 border-black space-y-2">
          <div className="text-xs font-black uppercase text-black flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-black" />
            Architectural Extension Contract
          </div>
          <p className="text-xs text-black/80 leading-relaxed font-mono font-medium">
            Pre-registered in <code>src/config/features.ts</code>. Simply implement{' '}
            <code>src/modules/teams/TeamMatcherView.tsx</code> to activate this module.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/assistant"
            className="neo-btn-primary text-xs py-3 px-6 !shadow-neo hover:!shadow-neo-sm"
          >
            <Bot className="w-4 h-4 text-[#ffe17c]" />
            <span>Try Active Feature 1: AI Assistant</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
