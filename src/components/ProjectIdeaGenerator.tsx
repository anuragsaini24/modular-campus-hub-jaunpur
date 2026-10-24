'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  X,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  RefreshCw,
} from 'lucide-react';
import { ProjectSuggestion } from '@/app/api/assistant/ideas/route';

interface ProjectIdeaGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectTitle: string) => void;
}

const AVAILABLE_TRACKS = [
  'Google Gemma Challenge (MLH Belt Bags)',
  'Best Open-Source AI Project (MLH Belt Bags)',
  'Best Use of Backboard ($5 Free Credit)',
  'Best Use of Render ($50 Credit)',
  'Hardware Track (Arduino Board & Sensors)',
];

const POPULAR_SKILLS = [
  'Next.js 15',
  'TypeScript',
  'Python',
  'Google Gemma 4',
  'Arduino / IoT',
  'FastAPI',
  'Tailwind CSS',
  'Backboard API',
];

export function ProjectIdeaGenerator({
  isOpen,
  onClose,
  onSelectProject,
}: ProjectIdeaGeneratorProps) {
  const [selectedTrack, setSelectedTrack] = useState(AVAILABLE_TRACKS[0]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Google Gemma 4',
    'Next.js 15',
    'TypeScript',
  ]);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [generationSource, setGenerationSource] = useState<string>('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/assistant/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: selectedTrack,
          skills: selectedSkills,
          teamSize,
        }),
      });

      const data = await res.json();
      if (res.ok && data.suggestions) {
        setSuggestions(data.suggestions);
        setGenerationSource(data.source || 'Grounded Hackathon Engine');
      }
    } catch (err) {
      console.error('Failed to generate project suggestions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-2xl max-w-4xl w-full max-h-[88vh] shadow-neo-xl overflow-hidden flex flex-col font-sans">
        {/* Header Bar */}
        <div className="bg-[#ffe17c] p-5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-[#ffe17c] flex items-center justify-center font-black border-2 border-black shadow-neo-sm">
              <Lightbulb className="w-6 h-6 text-[#ffe17c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight text-black">
                  Gemma 4 Project Suggestion Studio
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black text-[#ffe17c] border border-black">
                  MLH Track
                </span>
              </div>
              <p className="text-xs font-bold text-black/75">
                Generate winning hackathon concepts tailored to PIT Jaunpur &amp; Hacktoberfest 2026
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-xl bg-slate-50 border-2 border-black space-y-4 shadow-neo-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Track Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Target Prize Track:
                </label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none"
                >
                  {AVAILABLE_TRACKS.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Team Members (Capped 1-4 per PIT Jaunpur Rules):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTeamSize(size)}
                      className={`flex-1 py-1.5 rounded-lg border-2 border-black text-xs font-black transition-all ${
                        teamSize === size
                          ? 'bg-[#ffe17c] text-black shadow-neo-sm'
                          : 'bg-white text-black hover:bg-slate-100'
                      }`}
                    >
                      {size} {size === 1 ? 'Solo' : 'Devs'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Select Your Team&apos;s Tech Stack:
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((sk) => {
                  const isSel = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`text-xs font-bold px-3 py-1 rounded-md border-2 border-black transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#b7c6c2] text-black shadow-neo-sm font-black'
                          : 'bg-white text-black/70 hover:bg-slate-100'
                      }`}
                    >
                      {isSel ? `✓ ${sk}` : `+ ${sk}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full neo-btn-primary text-xs py-3 font-heading uppercase !shadow-neo hover:!shadow-neo-sm"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#ffe17c]" />
                  <span>Synthesizing Proposals with Gemma 4...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#ffe17c]" />
                  <span>Generate Grounded Hackathon Proposals</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-black border-b-2 border-black pb-2">
                <span className="font-heading font-black uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  3 Tailored Hackathon Deliverables ({generationSource})
                </span>
                <span className="text-[10px] font-mono bg-[#ffe17c] px-2 py-0.5 rounded border border-black">
                  6-Hour Sprint Format
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {suggestions.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-6 rounded-2xl bg-white border-2 border-black shadow-neo space-y-4 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
                      <div>
                        <h4 className="font-heading font-black text-xl uppercase text-black">
                          {proj.title}
                        </h4>
                        <p className="text-xs font-bold text-black/70">
                          {proj.tagline}
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-[#ffe17c] text-black border-2 border-black self-start sm:self-center shadow-neo-sm">
                        {proj.trackAlignment}
                      </span>
                    </div>

                    <div className="text-xs text-black/90 font-medium leading-relaxed">
                      <strong>Problem Solved:</strong> {proj.problemSolved}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-black text-black"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* 6-Hour Roadmap */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-black space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-black" />
                        6-Hour Saturday Roadmap:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono">
                        {proj.sixHourRoadmap.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2 rounded bg-white border border-black"
                          >
                            <span className="font-bold text-emerald-700 block">
                              {step.time}
                            </span>
                            <span className="text-black/80">{step.deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pitch Angle & Select Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-300 p-2 rounded-lg flex-1">
                        🎯 <strong>Judge Pitch Angle:</strong> {proj.judgePitchAngle}
                      </div>

                      {onSelectProject && (
                        <button
                          onClick={() => {
                            onSelectProject(
                              `How do we build "${proj.title}" using Gemma 4 during Hacktoberfest Jaunpur?`
                            );
                            onClose();
                          }}
                          className="neo-btn-primary text-xs py-2 px-4 shrink-0 !shadow-neo-sm"
                        >
                          <span>Ask Gemma About This</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
