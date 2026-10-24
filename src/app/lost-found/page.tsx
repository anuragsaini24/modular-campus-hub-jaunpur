import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft, Bot, GitBranch, Zap, ShieldCheck } from 'lucide-react';

export default function LostFoundPage() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
        <Link href="/assistant" className="hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to AI Assistant
        </Link>
        <span>/</span>
        <span className="text-black/60">Feature 3 Slot</span>
      </div>

      <div className="p-8 rounded-2xl bg-white border-2 border-black shadow-neo-lg space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center text-black shadow-neo-sm">
            <HelpCircle className="w-7 h-7" />
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#ffe17c] text-black border-2 border-black font-heading font-black uppercase shadow-neo-sm">
            Feature 3 Slot
          </span>
        </div>

        <div>
          <h1 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tight text-black">
            Digital Lost &amp; Found Portal
          </h1>
          <p className="text-sm font-semibold text-black/80 mt-2 leading-relaxed">
            Reserved extension slot for Feature 3. Provides a digital claims dashboard
            connected with the physical Student Welfare Desk (SWD) in Block A Ground
            Floor, allowing photo submissions and identity verification.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#b7c6c2]/30 border-2 border-black space-y-2">
          <div className="text-xs font-black uppercase text-black flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black" />
            Current Live Grounding Status
          </div>
          <p className="text-xs text-black/80 leading-relaxed font-mono font-medium">
            While this visual UI slot is pending Feature 3, the AI College Assistant
            (Feature 1) is ALREADY fully grounded in the official SWD protocol and answers
            all student lost-and-found queries immediately!
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/assistant"
            className="neo-btn-primary text-xs py-3 px-6 !shadow-neo hover:!shadow-neo-sm"
          >
            <Bot className="w-4 h-4 text-[#ffe17c]" />
            <span>Ask AI Assistant About Lost &amp; Found</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
