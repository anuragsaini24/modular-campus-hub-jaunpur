'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle,
  Video,
  Film,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  script: string;
  content: {
    heading: string;
    points: { icon: string; title: string; desc: string }[];
    highlight?: string;
  };
}

const PITCH_SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Modular Campus Hub',
    subtitle: 'Feature 1: AI College Assistant for Hacktoberfest Hack Day Jaunpur',
    badge: 'Opening Pitch',
    script:
      'Welcome judges and fellow hackers to Modular Campus Hub! Designed specifically for Hacktoberfest Hack Day Jaunpur at Prasad Institute of Technology, our flagship Feature 1 delivers a zero-hallucination AI College Assistant powered by Google Gemma 4 and local hybrid RAG.',
    content: {
      heading: 'Empowering Students & Hackers at Prasad Institute of Technology',
      points: [
        {
          icon: '🎓',
          title: 'Campus Intelligence',
          desc: 'Instantly answers student inquiries regarding hackathons, team matching, and lost & found.',
        },
        {
          icon: '🤖',
          title: 'Google Gemma 4 Grounding',
          desc: 'Cites exact uploaded documents and refuses to hallucinate unverified policies or dates.',
        },
        {
          icon: '💎',
          title: '100% Free ($0 Cost)',
          desc: 'Zero-cost architecture leveraging Google AI Studio free tier, Backboard, and Render blueprints.',
        },
      ],
      highlight: 'Built for Hacktoberfest Hack Day Jaunpur • 24 October 2026',
    },
  },
  {
    id: 2,
    title: 'The Challenge in Collegiate Hackathons',
    subtitle: 'Information Chaos & Overwhelmed Student Coordinators',
    badge: 'Problem Statement',
    script:
      'During major collegiate hackathons, student desks get flooded with repetitive questions: When does hacking start? How do solo developers find teammates? Where is the lost wallet deposited? Organizers spend hours repeating answers, while students get stranded.',
    content: {
      heading: 'The Three Friction Points Solved',
      points: [
        {
          icon: '⏳',
          title: 'Event Schedule Confusion',
          desc: 'Hundreds of hackers asking "When is the next milestone?" or "Where is lunch served?"',
        },
        {
          icon: '🤝',
          title: 'Solo Hacker Isolation',
          desc: 'First-time attendees asking "How do I form or join a project team before hacking begins?"',
        },
        {
          icon: '🎒',
          title: 'Misplaced Valuables',
          desc: 'Frantic queries like "Where do I report a lost item or claim a found college ID card?"',
        },
      ],
      highlight: 'Standard chatbots hallucinate fake rooms and dates. Students need 100% verified ground truth.',
    },
  },
  {
    id: 3,
    title: 'Our Solution: Grounded AI Assistant',
    subtitle: 'Google Gemma 4 + Local Hybrid BM25 & Semantic RAG',
    badge: 'Solution Architecture',
    script:
      'Our solution is Feature 1: AI College Assistant. It combines a local hybrid BM25 and synonym-boosted retriever with Google Gemma 4 models. Every response cites the exact document title and provides an interactive source inspector.',
    content: {
      heading: 'Zero Hallucination Guaranteed',
      points: [
        {
          icon: '⚡',
          title: 'Hybrid BM25 + Intent Retrieval',
          desc: 'Fast, local indexing in d:/anurag/data/ with zero external database API fees or cold-starts.',
        },
        {
          icon: '🧠',
          title: 'Gemma 4 (31B-IT / 26B-A4B-IT)',
          desc: 'Powered by Google AI Studio free tier with a strict system grounding prompt.',
        },
        {
          icon: '🛡️',
          title: 'Defensive Safety Refusal',
          desc: 'Explicitly declines to guess when a topic is absent from campus documentation.',
        },
      ],
      highlight: 'Guaranteed compliance with MLH Gemma Challenge rubric — answers solely from uploaded info.',
    },
  },
  {
    id: 4,
    title: 'Team Knowledge Studio',
    subtitle: 'Universal Document Ingestion & Live Emergency Notices',
    badge: 'Key Capabilities',
    script:
      'Campus coordinators can drag and drop PDFs, Markdown rules, or text circulars into the Team Knowledge Studio. Text is extracted instantly using unpdf and chunked. Organizers can even broadcast live notices that the AI learns in seconds.',
    content: {
      heading: 'Complete Knowledge Lifecycle',
      points: [
        {
          icon: '📄',
          title: 'Universal Ingestion',
          desc: 'Upload .pdf, .md, and .txt files with automatic section boundary chunking.',
        },
        {
          icon: '📢',
          title: 'Instant Notice Publisher',
          desc: 'Publish emergency announcements (e.g. Wi-Fi restart) and chat answers it immediately.',
        },
        {
          icon: '🔐',
          title: 'Passcode Protected',
          desc: 'Secured via team passcode ("pit2026") with a 1-click unlock button for judges.',
        },
      ],
      highlight: 'Includes pre-seeded data for PIT Jaunpur Hacktoberfest 2026, teams, and SWD Lost & Found.',
    },
  },
  {
    id: 5,
    title: 'Persistent Conversational Threads',
    subtitle: 'Backboard API Integration + Local JSON Atomic Fallback',
    badge: 'Backboard Track',
    script:
      'For the Backboard track, we connect to Backboard REST endpoints to synchronize persistent conversation threads and upload assistant documents. When offline or without a key, the app gracefully falls back to local JSON persistence.',
    content: {
      heading: 'Dual-Layer Memory Architecture',
      points: [
        {
          icon: '🌐',
          title: 'Backboard Cloud Sync',
          desc: 'Leverages $5 sponsor credit for remote thread persistence and assistant memory.',
        },
        {
          icon: '💾',
          title: 'Local Atomic JSON',
          desc: 'Guarantees $0 forever operation even without external cloud dependencies.',
        },
        {
          icon: '🔄',
          title: 'Multi-Turn Continuity',
          desc: 'Remembers context across multiple student questions in the same session.',
        },
      ],
      highlight: 'Clean abstraction layer in src/lib/ai/backboard.ts supporting zero-config fallbacks.',
    },
  },
  {
    id: 6,
    title: 'Production Readiness & Host Isolation',
    subtitle: '31 Passing Automated Tests & Strict D: External SSD Storage',
    badge: 'Quality & Engineering',
    script:
      'We followed strict software engineering practices: thirty-one automated Vitest tests verifying BM25 retrieval, natural phrasing variations, and API routes. Furthermore, all npm caches and files are strictly isolated on the external D drive.',
    content: {
      heading: 'Judge Verification Standards',
      points: [
        {
          icon: '✅',
          title: '31 / 31 Vitest Tests',
          desc: 'Comprehensive automated test suite covering queries, routing, grounding, and store.',
        },
        {
          icon: '🚀',
          title: 'Render Free Blueprint',
          desc: 'render.yaml ready for 1-click cloud deployment with public judge URLs.',
        },
        {
          icon: '🛡️',
          title: 'D: SSD Storage Confinement',
          desc: 'Zero writes to host C: drive. All temp files, caches, and indexes live on D:.',
        },
      ],
      highlight: 'Full test suite executes in under 1 second: npm test with zero flaky dependencies.',
    },
  },
  {
    id: 7,
    title: 'Summary & Live Demo',
    subtitle: 'Modular Campus Hub is Ready for Production and Judging',
    badge: 'Conclusion',
    script:
      'Thank you judges! Modular Campus Hub delivers real, grounded intelligence for Prasad Institute of Technology. Feel free to test the 1-click starter prompts, upload a new circular in the studio, or inspect the test suite. We look forward to your feedback!',
    content: {
      heading: 'Live Demonstration Checklist',
      points: [
        {
          icon: '⚡',
          title: '1. Ask Hackathon Question',
          desc: 'Click "When is the next hackathon?" and inspect the 24 October 2026 citation.',
        },
        {
          icon: '🛡️',
          title: '2. Verify Refusal Safety',
          desc: 'Click "Does campus have a swimming pool?" to verify zero hallucination.',
        },
        {
          icon: '📢',
          title: '3. Publish Live Notice',
          desc: 'Unlock studio, publish a notice, and ask the AI about it 2 seconds later.',
        },
      ],
      highlight: 'Modular extension slots ready for Feature 2 (Team Matcher) and Feature 3 (Lost & Found).',
    },
  },
];

export function PitchDeckView() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentSlide = PITCH_SLIDES[currentSlideIndex];

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakCurrentSlide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(currentSlide.script);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (isPlaying) {
        if (currentSlideIndex < PITCH_SLIDES.length - 1) {
          setCurrentSlideIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setProgressPercent(100);
        }
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setProgressPercent(((currentSlideIndex + 1) / PITCH_SLIDES.length) * 100);
    if (isPlaying) {
      speakCurrentSlide();
    }
  }, [currentSlideIndex]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      speakCurrentSlide();
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < PITCH_SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Neo-Brutalist 1280x720 Canvas Slide Renderer
  const drawSlideToCanvas = (ctx: CanvasRenderingContext2D, slide: Slide, progress: number) => {
    const w = 1280;
    const h = 720;

    // Background #ffe17c Yellow
    ctx.fillStyle = '#ffe17c';
    ctx.fillRect(0, 0, w, h);

    // 32px x 32px Radial Dot Pattern
    ctx.fillStyle = '#000000';
    for (let x = 16; x < w; x += 32) {
      for (let y = 16; y < h; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer Border 4px Black
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Top Header Bar Card
    ctx.fillStyle = '#171e19';
    ctx.fillRect(40, 40, w - 80, 50);
    ctx.strokeRect(40, 40, w - 80, 50);

    // Badge Pill
    ctx.fillStyle = '#ffe17c';
    ctx.font = '900 16px sans-serif';
    ctx.fillText(`⚡ ${slide.badge.toUpperCase()}`, 60, 72);

    ctx.fillStyle = '#b7c6c2';
    ctx.font = '700 14px monospace';
    ctx.fillText(`SLIDE ${slide.id} OF ${PITCH_SLIDES.length} • PIT JAUNPUR`, w - 340, 72);

    // Slide Title Container (White Card with 8px hard shadow)
    ctx.fillStyle = '#000000';
    ctx.fillRect(48, 118, w - 80, 80); // Shadow

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 110, w - 80, 80);
    ctx.strokeRect(40, 110, w - 80, 80);

    ctx.fillStyle = '#000000';
    ctx.font = '900 32px sans-serif';
    ctx.fillText(slide.title.toUpperCase(), 60, 150);

    ctx.fillStyle = '#333333';
    ctx.font = '600 17px sans-serif';
    ctx.fillText(slide.subtitle, 60, 175);

    // 3 Content Cards (Neo-Brutalist White Cards with 8px hard shadow)
    const cardWidth = 360;
    const cardHeight = 230;
    const startY = 220;

    slide.content.points.forEach((pt, i) => {
      const cardX = 40 + i * (cardWidth + 60);

      // Hard Shadow (8px offset)
      ctx.fillStyle = '#000000';
      ctx.fillRect(cardX + 8, startY + 8, cardWidth, cardHeight);

      // Card Body
      ctx.fillStyle = i === 1 ? '#b7c6c2' : '#ffffff';
      ctx.fillRect(cardX, startY, cardWidth, cardHeight);
      ctx.strokeRect(cardX, startY, cardWidth, cardHeight);

      // Icon Box
      ctx.fillStyle = '#ffe17c';
      ctx.fillRect(cardX + 20, startY + 20, 50, 50);
      ctx.strokeRect(cardX + 20, startY + 20, 50, 50);

      ctx.font = '28px sans-serif';
      ctx.fillText(pt.icon, cardX + 30, startY + 55);

      // Point Title
      ctx.fillStyle = '#000000';
      ctx.font = '900 18px sans-serif';
      ctx.fillText(pt.title.toUpperCase(), cardX + 20, startY + 105);

      // Description (Wrapped text)
      ctx.fillStyle = '#171e19';
      ctx.font = '500 14px sans-serif';
      const words = pt.desc.split(' ');
      let line = '';
      let lineY = startY + 135;
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > cardWidth - 40 && line !== '') {
          ctx.fillText(line, cardX + 20, lineY);
          line = word + ' ';
          lineY += 22;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardX + 20, lineY);
    });

    // Highlight Banner at Bottom
    if (slide.content.highlight) {
      const hlY = 485;
      ctx.fillStyle = '#000000';
      ctx.fillRect(48, hlY + 8, w - 80, 50);

      ctx.fillStyle = '#ffe17c';
      ctx.fillRect(40, hlY, w - 80, 50);
      ctx.strokeRect(40, hlY, w - 80, 50);

      ctx.fillStyle = '#000000';
      ctx.font = '800 15px sans-serif';
      ctx.fillText(`✓ ${slide.content.highlight}`, 60, hlY + 32);
    }

    // Voiceover Transcript Box
    const transY = 560;
    ctx.fillStyle = '#171e19';
    ctx.fillRect(40, transY, w - 80, 95);
    ctx.strokeRect(40, transY, w - 80, 95);

    ctx.fillStyle = '#ffe17c';
    ctx.font = '800 12px sans-serif';
    ctx.fillText('AUDIO SCRIPT VOICEOVER:', 60, transY + 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 14px sans-serif';
    const scriptWords = slide.script.split(' ');
    let sLine = '';
    let sY = transY + 48;
    for (const wItem of scriptWords) {
      const testLine = sLine + wItem + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > w - 140 && sLine !== '') {
        ctx.fillText(sLine, 60, sY);
        sLine = wItem + ' ';
        sY += 22;
      } else {
        sLine = testLine;
      }
    }
    ctx.fillText(sLine, 60, sY);

    // Progress bar at the very bottom
    ctx.fillStyle = '#000000';
    ctx.fillRect(40, h - 35, w - 80, 10);
    ctx.fillStyle = '#ffe17c';
    ctx.fillRect(40, h - 35, (w - 80) * (progress / 100), 10);
    ctx.strokeRect(40, h - 35, w - 80, 10);
  };

  // Generate & Download WebM Pitch Video
  const handleExportPitchVideo = async () => {
    if (typeof window === 'undefined') return;
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsExportingVideo(true);
    setExportProgressText('Initializing Neo-Brutalist Video Canvas Encoder...');

    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3500000 });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modular-campus-hub-pitch.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExportingVideo(false);
        setExportProgressText('');
      };

      mediaRecorder.start();

      for (let sIdx = 0; sIdx < PITCH_SLIDES.length; sIdx++) {
        const slide = PITCH_SLIDES[sIdx];
        setExportProgressText(`Rendering Video: Slide ${sIdx + 1} of ${PITCH_SLIDES.length} (${slide.badge})...`);

        const frames = 30;
        for (let f = 0; f <= frames; f++) {
          const currentSlideProg = (f / frames) * 100;
          drawSlideToCanvas(ctx, slide, currentSlideProg);
          await new Promise((r) => setTimeout(r, 33));
        }
      }

      setExportProgressText('Packaging WebM Video File...');
      await new Promise((r) => setTimeout(r, 500));
      mediaRecorder.stop();
    } catch (err) {
      console.error('Video generation error:', err);
      alert('Unable to generate video stream directly in this browser.');
      setIsExportingVideo(false);
      setExportProgressText('');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Hidden 1280x720 canvas for WebM video export */}
      <canvas ref={hiddenCanvasRef} width={1280} height={720} className="hidden" />

      {/* Top Heading Banner in Neo-Brutalist Yellow */}
      <div className="bg-[#ffe17c] border-2 border-black rounded-2xl p-6 md:p-8 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-black text-[#ffe17c] px-3 py-1 rounded-full border border-black text-xs font-black uppercase mb-3 shadow-neo-sm">
            <Zap className="w-3.5 h-3.5 fill-[#ffe17c]" />
            Official Pitch Video &amp; Presentation
          </div>
          <h1 className="font-heading font-black text-2xl md:text-4xl uppercase tracking-tight text-black">
            Hackathon Pitch Deck
          </h1>
          <p className="text-sm font-semibold text-black/80 mt-1 max-w-xl">
            Interactive presentation artifact for Hacktoberfest Hack Day Jaunpur judges
            and organizers. Listen with real-time voice narration or download as WebM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportPitchVideo}
            disabled={isExportingVideo}
            className="neo-btn-primary text-xs py-3 px-5 !shadow-neo disabled:opacity-50 hover:!shadow-neo-sm"
          >
            {isExportingVideo ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#ffe17c]" />
                <span>Exporting Video...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#ffe17c]" />
                <span>Download Pitch Video (.webm)</span>
              </>
            )}
          </button>

          <Link
            href="/assistant"
            className="neo-btn-secondary text-xs py-3 px-5 !shadow-neo hover:!shadow-neo-sm"
          >
            <span>Launch Live Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Video Export Progress Banner */}
      {isExportingVideo && (
        <div className="p-4 rounded-xl bg-indigo-100 border-2 border-black text-black font-bold text-xs flex items-center gap-2.5 shadow-neo animate-pulse">
          <Film className="w-5 h-5 text-indigo-700 shrink-0" />
          <span>{exportProgressText}</span>
        </div>
      )}

      {/* Presentation Video Player Viewport */}
      <div
        ref={containerRef}
        className="rounded-2xl bg-white border-2 border-black shadow-neo-xl overflow-hidden flex flex-col"
      >
        {/* Browser Mockup Top Bar with 3 Colored Dots */}
        <div className="bg-[#171e19] px-4 py-3 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-black" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-black" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-black" />
          </div>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            {currentSlide.badge} &bull; SLIDE {currentSlide.id} OF {PITCH_SLIDES.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded text-gray-300 hover:text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Video Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Stage Slide */}
        <div className="p-6 md:p-10 min-h-[400px] md:min-h-[460px] flex flex-col justify-between relative bg-[#ffe17c]/20 neo-dot-pattern">
          {/* Slide Heading */}
          <div className="space-y-2">
            <div className="inline-block bg-[#b7c6c2] text-black text-xs font-black uppercase px-3 py-1 rounded border-2 border-black shadow-neo-sm">
              {currentSlide.badge}
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tight text-black">
              {currentSlide.title}
            </h2>
            <p className="text-sm md:text-base font-bold text-black/70">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* 3 Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            {currentSlide.content.points.map((pt, pIdx) => (
              <div
                key={pIdx}
                className="p-5 rounded-xl bg-white border-2 border-black shadow-neo space-y-2"
              >
                <div className="w-12 h-12 rounded-lg bg-[#ffe17c] border-2 border-black flex items-center justify-center text-2xl shadow-neo-sm mb-2">
                  {pt.icon}
                </div>
                <h4 className="font-heading font-black text-base uppercase text-black">
                  {pt.title}
                </h4>
                <p className="text-xs text-black/80 font-medium leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Highlight Banner */}
          {currentSlide.content.highlight && (
            <div className="p-3.5 rounded-xl bg-[#b7c6c2] border-2 border-black text-xs font-black uppercase text-black flex items-center gap-2 shadow-neo-sm">
              <CheckCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{currentSlide.content.highlight}</span>
            </div>
          )}
        </div>

        {/* Presentation Controls Bar in Deep Charcoal #171e19 */}
        <div className="bg-[#171e19] p-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-lg bg-[#272727] text-white border-2 border-black hover:bg-[#ffe17c] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed shadow-neo-sm transition-colors"
              title="Previous Slide"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-lg bg-[#ffe17c] text-black border-2 border-black font-heading font-black text-xs uppercase flex items-center gap-2 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-black" />
                  <span>Pause Presentation</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Play Video Presentation</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === PITCH_SLIDES.length - 1}
              className="p-2 rounded-lg bg-[#272727] text-white border-2 border-black hover:bg-[#ffe17c] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed shadow-neo-sm transition-colors"
              title="Next Slide"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-[#272727] px-2 py-1 rounded border-2 border-black">
              <span className="text-[10px] text-gray-400">SPEED:</span>
              {[1, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    playbackSpeed === spd
                      ? 'bg-[#ffe17c] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded bg-[#272727] text-white hover:text-[#ffe17c]"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="w-full bg-black h-2.5">
          <div
            className="bg-[#ffe17c] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Synchronized Transcript Drawer */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-neo space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <span className="font-heading font-black text-sm uppercase text-black flex items-center gap-2">
            <Zap className="w-4 h-4 fill-black" />
            Synchronized Voiceover Audio Script
          </span>
          <span className="text-xs font-mono font-bold text-black/60">
            Slide {currentSlide.id}: {currentSlide.title}
          </span>
        </div>
        <p className="text-sm font-semibold text-black/90 leading-relaxed font-sans">
          &ldquo;{currentSlide.script}&rdquo;
        </p>
      </div>
    </div>
  );
}
