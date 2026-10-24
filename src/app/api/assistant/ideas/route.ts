import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/knowledge/store';

export const runtime = 'nodejs';

export interface ProjectSuggestion {
  id: string;
  title: string;
  tagline: string;
  trackAlignment: string;
  techStack: string[];
  problemSolved: string;
  sixHourRoadmap: { phase: string; time: string; deliverable: string }[];
  judgePitchAngle: string;
}

const SEED_PROJECTS: ProjectSuggestion[] = [
  {
    id: 'proj-1',
    title: 'GemmaCampus Pulse',
    tagline: 'Zero-hallucination real-time campus advisory and hardware lab monitor',
    trackAlignment: 'Google Gemma Challenge & Best Open-Source AI Project',
    techStack: ['Google Gemma 4 (31B-IT)', 'Next.js 15', 'Backboard API', 'Render Cloud'],
    problemSolved:
      'Solves collegiate information chaos during Hacktoberfest Jaunpur by giving hackers grounded answers about schedules, hardware kits, and submission deadlines.',
    sixHourRoadmap: [
      { phase: 'Phase 1: Ingestion & Chunker', time: '10:30 AM - 12:00 PM', deliverable: 'Index college guidelines & circulars with BM25 retriever' },
      { phase: 'Phase 2: Gemma 4 Grounding', time: '12:00 PM - 01:30 PM', deliverable: 'Connect gemma-4-31b-it with strict system citation prompt' },
      { phase: 'Phase 3: Backboard & Live Pitch', time: '01:45 PM - 02:45 PM', deliverable: 'Deploy to Render on free tier and rehearse 3-min pitch' },
    ],
    judgePitchAngle:
      'Demonstrates real zero-hallucination grounding: when asked about unrecorded facilities (e.g. swimming pool), it safely refuses to guess!',
  },
  {
    id: 'proj-2',
    title: 'PIT AgroTech Sense',
    tagline: 'Edge IoT crop disease detector and farmer advisory powered by Gemma 4',
    trackAlignment: 'Google Gemma Challenge & Hardware Track (Arduino Kit)',
    techStack: ['Gemma 4 (26B-MoE)', 'Arduino Hardware Kit', 'Python FastAPI', 'Free .xyz Domain'],
    problemSolved:
      'Empowers Eastern UP farmers in Jaunpur district with localized crop pest identification and Hindi/Bhojpuri voice advisory.',
    sixHourRoadmap: [
      { phase: 'Phase 1: Sensor & Camera Hookup', time: '10:30 AM - 12:00 PM', deliverable: 'Connect soil sensor to official Arduino board' },
      { phase: 'Phase 2: Multimodal Diagnosis', time: '12:00 PM - 01:30 PM', deliverable: 'Stream sensor telemetry to Gemma 4 for localized treatment plan' },
      { phase: 'Phase 3: Live Hardware Demo', time: '01:45 PM - 02:45 PM', deliverable: 'Live soil moisture alert triggering automated advisory' },
    ],
    judgePitchAngle:
      'Directly impacts the local Jaunpur agricultural belt using official MLH Arduino hardware and Google Gemma 4!',
  },
  {
    id: 'proj-3',
    title: 'Backboard TeamForge',
    tagline: 'Persistent memory matchmaking assistant for solo hackathon developers',
    trackAlignment: 'Best Use of Backboard ($5 Credit) & Gemma Challenge',
    techStack: ['Backboard API', 'Google Gemma 4', 'TypeScript', 'Tailwind CSS'],
    problemSolved:
      'Eliminates the friction of solo hackers finding compatible teammates before the 1:00 PM hacking checkpoint.',
    sixHourRoadmap: [
      { phase: 'Phase 1: Profile Schema', time: '10:30 AM - 12:00 PM', deliverable: 'Skill vector extraction using Backboard document scopes' },
      { phase: 'Phase 2: Persistent Threads', time: '12:00 PM - 01:30 PM', deliverable: 'Multi-turn candidate interview via Backboard thread API' },
      { phase: 'Phase 3: Instant Roster Match', time: '01:45 PM - 02:45 PM', deliverable: 'Algorithmically match teams capped at 1-4 members' },
    ],
    judgePitchAngle:
      'Combines Backboard sovereign persistent threads with Gemma 4 for multi-turn contextual recruiting.',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { track, skills = [], teamSize = 2 } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is present, invoke Gemma 4 to craft tailored ideas
    if (apiKey && apiKey.trim() !== '') {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are the Lead Mentor for Hacktoberfest Hack Day Jaunpur (at Prasad Institute of Technology, Jaunpur).
Generate 3 HIGH-IMPACT, WINNING hackathon project ideas tailored to:
- Selected Track: "${track || 'Google Gemma Challenge'}"
- Student Tech Skills: ${skills.length > 0 ? skills.join(', ') : 'Next.js, Python, Gemma 4, Arduino'}
- Team Size: ${teamSize} (Capped at 1 to 4 members per PIT Jaunpur rules)
- Hardware available at venue: Official MLH Arduino Hardware kits, free .xyz domain codes.

FORMAT AS STRICT VALID JSON ARRAY of 3 objects with these exact keys:
[
  {
    "id": "proj-custom-1",
    "title": "Short Catchy Name",
    "tagline": "One sentence punchy summary",
    "trackAlignment": "Which Hacktoberfest prize it targets",
    "techStack": ["Tool 1", "Tool 2", "Gemma 4", "Render"],
    "problemSolved": "Specific campus or regional problem solved in Jaunpur",
    "sixHourRoadmap": [
      { "phase": "Phase 1: Blockout", "time": "10:30 AM - 12:00 PM", "deliverable": "MVP core" },
      { "phase": "Phase 2: Gemma Integration", "time": "12:00 PM - 01:30 PM", "deliverable": "AI logic" },
      { "phase": "Phase 3: Pitch Rehearsal", "time": "01:45 PM - 02:45 PM", "deliverable": "Deploy" }
    ],
    "judgePitchAngle": "Why MLH judges will award it 1st place"
  }
]
Output ONLY raw JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemma-4-31b-it',
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'Gemma 4 (31B-IT Live Neural)',
            suggestions: parsed,
          });
        }
      } catch (gemErr) {
        console.warn('Gemma idea generator fallback:', gemErr);
      }
    }

    // High-fidelity seed suggestions tailored to PIT Jaunpur Hacktoberfest tracks
    const filtered = SEED_PROJECTS.map((p, idx) => ({
      ...p,
      trackAlignment: track || p.trackAlignment,
      techStack: Array.from(new Set([...p.techStack, ...(skills.slice(0, 2))])),
    }));

    return NextResponse.json({
      success: true,
      source: 'Grounded Hacktoberfest Seed Engine ($0 Free Tier)',
      suggestions: filtered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate project suggestions.' },
      { status: 500 }
    );
  }
}
