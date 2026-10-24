'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, ChatThread, Citation } from '@/types';
import { ProjectIdeaGenerator } from '@/components/ProjectIdeaGenerator';

const STARTER_PROMPTS = [
  {
    icon: '⚡',
    label: 'When is the next hackathon?',
    category: 'Hackathons',
  },
  {
    icon: '👥',
    label: 'How do I join a project team?',
    category: 'Teams',
  },
  {
    icon: '🔍',
    label: 'Where do I report a lost item?',
    category: 'Lost & Found',
  },
  {
    icon: '🇮🇳',
    label: 'Agla hackathon kab aur kahan hai?',
    category: 'Hinglish / Local PIT',
  },
  {
    icon: '🛡️',
    label: 'Does the campus have an Olympic swimming pool?',
    category: 'Test Grounding Refusal',
  },
];

export function AssistantView() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitationIndex, setExpandedCitationIndex] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice & Speech State
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isIdeaGeneratorOpen, setIsIdeaGeneratorOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Fetch threads on mount
  useEffect(() => {
    fetch('/api/assistant/threads')
      .then((res) => res.json())
      .then((data) => {
        if (data.threads && data.threads.length > 0) {
          setThreads(data.threads);
          setActiveThreadId(data.threads[0].id);
          setMessages(data.threads[0].messages || []);
        } else {
          handleNewChat();
        }
      })
      .catch(() => {
        handleNewChat();
      });

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSelectThread = (thread: ChatThread) => {
    setActiveThreadId(thread.id);
    setMessages(thread.messages || []);
  };

  const handleNewChat = () => {
    fetch('/api/assistant/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Campus Inquiry' }),
    })
      .then((res) => res.json())
      .then((newThread: ChatThread) => {
        setThreads((prev) => [newThread, ...prev]);
        setActiveThreadId(newThread.id);
        setMessages([]);
      })
      .catch((err) => {
        console.error('Failed to create new thread:', err);
      });
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    fetch(`/api/assistant/threads?id=${id}`, { method: 'DELETE' })
      .then(() => {
        const remaining = threads.filter((t) => t.id !== id);
        setThreads(remaining);
        if (activeThreadId === id) {
          if (remaining.length > 0) {
            handleSelectThread(remaining[0]);
          } else {
            handleNewChat();
          }
        }
      })
      .catch((err) => console.error('Failed to delete thread:', err));
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    setInputQuery('');
    setIsLoading(true);

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          threadId: activeThreadId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
        if (data.thread) {
          setThreads((prev) =>
            prev.map((t) => (t.id === data.thread.id ? data.thread : t))
          );
        }
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: data.error || 'Unable to retrieve answer. Please try again.',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Network error communicating with Campus Assistant.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Web Speech Synthesis (Read Aloud)
  const toggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[Source:.*?\]/g, '').replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition (Microphone input)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Optimized for Indian English / Hinglish collegiate accent

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 bg-[#ffe17c]/15">
      {/* Project Idea Generator Modal */}
      <ProjectIdeaGenerator
        isOpen={isIdeaGeneratorOpen}
        onClose={() => setIsIdeaGeneratorOpen(false)}
        onSelectProject={(prompt) => handleSendMessage(prompt)}
      />

      {/* Thread History Sidebar in Neo-Brutalist Charcoal */}
      <div className="hidden lg:flex flex-col w-72 border-r-2 border-black bg-[#171e19] p-4 justify-between">
        <div>
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ffe17c] hover:bg-white text-black font-heading font-black uppercase text-sm transition-all border-2 border-black shadow-neo hover:shadow-neo-sm mb-3 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-black" />
            New Campus Chat
          </button>

          {/* Project Ideas Generator Button */}
          <button
            onClick={() => setIsIdeaGeneratorOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#b7c6c2] hover:bg-white text-black font-heading font-black uppercase text-xs transition-all border-2 border-black shadow-neo-sm mb-4 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-black" />
            💡 Gemma 4 Idea Generator
          </button>

          <div className="text-[11px] font-black text-[#b7c6c2] uppercase tracking-widest px-2 py-1 mb-2">
            Recent Inquiries
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-310px)] pr-1">
            {threads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  className={`group flex items-center justify-between p-3 rounded-lg text-xs font-bold cursor-pointer border-2 border-black transition-all ${
                    isActive
                      ? 'bg-[#ffe17c] text-black shadow-neo-sm translate-x-1'
                      : 'bg-white text-black hover:bg-[#b7c6c2]'
                  }`}
                >
                  <span className="truncate pr-2 font-mono">
                    {thread.title || 'Campus Inquiry'}
                  </span>
                  <button
                    onClick={(e) => handleDeleteThread(thread.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-black hover:text-red-600 transition-opacity"
                    title="Delete thread"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#272727] border-2 border-black text-xs text-white shadow-neo-sm space-y-1">
          <div className="flex items-center gap-2 font-heading font-black text-[#ffe17c] uppercase">
            <ShieldCheck className="w-4 h-4 text-[#ffe17c]" />
            Grounded RAG Mode
          </div>
          <p className="text-[11px] text-gray-300 font-medium">
            Strictly cites uploaded PIT Jaunpur circulars. English + Hinglish enabled.
          </p>
        </div>
      </div>

      {/* Chat Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#ffe17c]/20">
        {/* Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto text-center px-4 py-8">
              <div className="w-20 h-20 rounded-2xl bg-[#ffe17c] border-2 border-black flex items-center justify-center mb-5 shadow-neo-lg">
                <Bot className="w-10 h-10 text-black" />
              </div>

              <div className="inline-flex items-center gap-2 bg-[#b7c6c2] text-black px-3 py-1 rounded-full border-2 border-black text-xs font-black uppercase mb-3 shadow-neo-sm">
                <span>English &amp; Hinglish Grounded</span>
                <span>&bull;</span>
                <span>Voice Q&amp;A Ready</span>
              </div>

              <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tight text-black mb-3">
                PIT Jaunpur AI College Assistant
              </h2>
              <p className="text-base text-black/80 font-medium mb-6 max-w-xl leading-relaxed">
                Ask about <strong>Hacktoberfest Hack Day Jaunpur 2026</strong>, team matching,
                lost items, or generate winning project ideas powered by Google Gemma 4.
              </p>

              {/* Action Banner for Project Idea Generator */}
              <button
                onClick={() => setIsIdeaGeneratorOpen(true)}
                className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffe17c] hover:bg-white text-black border-2 border-black font-heading font-black text-xs uppercase shadow-neo hover:shadow-neo-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Need Ideas? Open Gemma 4 Project Suggestion Studio</span>
              </button>

              {/* Starter Prompt Cards in Neo-Brutalist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                {STARTER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.label)}
                    className="p-4 rounded-xl bg-white border-2 border-black shadow-neo hover:shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:bg-[#ffe17c] transition-all flex items-start gap-3.5 group cursor-pointer"
                  >
                    <span className="text-2xl shrink-0">{prompt.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black/60 group-hover:text-black">
                        {prompt.category}
                      </span>
                      <span className="text-sm font-heading font-black text-black">
                        {prompt.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-6">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isSpeaking = speakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-3 md:gap-4 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-10 h-10 rounded-xl bg-[#ffe17c] border-2 border-black flex items-center justify-center font-black text-black shrink-0 shadow-neo-sm">
                        <Zap className="w-5 h-5 fill-black" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-5 border-2 border-black ${
                        isUser
                          ? 'bg-[#ffe17c] text-black shadow-neo'
                          : 'bg-white text-black shadow-neo'
                      }`}
                    >
                      {/* Message Author & Action Controls */}
                      <div className="flex items-center justify-between border-b-2 border-black/10 pb-2 mb-3 text-xs font-bold">
                        <span className="font-heading font-black uppercase tracking-tight">
                          {isUser ? 'Student' : 'Campus Assistant'}
                        </span>
                        {!isUser && (
                          <div className="flex items-center gap-2">
                            {msg.groundingMode && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#b7c6c2] text-black border border-black">
                                {msg.modelUsed || 'Gemma 4 Grounded'}
                              </span>
                            )}

                            {/* Voice Read Aloud Button */}
                            <button
                              onClick={() => toggleSpeech(msg.id, msg.content)}
                              className={`p-1.5 rounded border border-black transition-colors ${
                                isSpeaking
                                  ? 'bg-black text-[#ffe17c]'
                                  : 'bg-slate-100 text-black hover:bg-[#ffe17c]'
                              }`}
                              title={isSpeaking ? 'Stop Audio' : 'Read Aloud with Voice'}
                            >
                              {isSpeaking ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => copyToClipboard(msg.id, msg.content)}
                              className="p-1.5 rounded border border-black bg-slate-100 text-black hover:bg-[#ffe17c]"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Grounded Citation Badges */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-4 pt-3 border-t-2 border-black/10 space-y-2">
                          <div className="text-xs font-black uppercase tracking-wider text-black/70 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Verified Campus Sources:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((cit, cIdx) => (
                              <div
                                key={cIdx}
                                className="inline-flex items-center gap-1 text-xs font-bold bg-[#b7c6c2] text-black px-2.5 py-1 rounded-md border-2 border-black shadow-neo-sm"
                              >
                                <span className="w-2 h-2 rounded-full bg-black" />
                                <span>{cit.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inspect Grounded Evidence Accordion */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-4 pt-2">
                          <button
                            onClick={() =>
                              setExpandedCitationIndex(
                                expandedCitationIndex === msg.id ? null : msg.id
                              )
                            }
                            className="text-xs font-black uppercase text-black hover:underline flex items-center gap-1.5 bg-[#f4f4f5] px-3 py-1.5 rounded-lg border-2 border-black shadow-neo-sm"
                          >
                            <span>
                              {expandedCitationIndex === msg.id
                                ? 'Hide Grounded Evidence'
                                : 'Inspect Retrieved Evidence (Judge Drawer)'}
                            </span>
                            {expandedCitationIndex === msg.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>

                          {expandedCitationIndex === msg.id && (
                            <div className="mt-3 p-4 rounded-xl bg-slate-50 border-2 border-black space-y-3 shadow-neo-sm">
                              <div className="text-xs font-black uppercase text-black">
                                Grounded Chunks Ingested by Gemma 4:
                              </div>
                              {msg.citations.map((c, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg bg-white border-2 border-black text-xs space-y-1.5"
                                >
                                  <div className="flex items-center justify-between font-bold text-black">
                                    <span className="font-heading uppercase">{c.title}</span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ffe17c] border border-black">
                                      Match Score: {c.score}
                                    </span>
                                  </div>
                                  <p className="text-black/80 font-mono text-[11px] leading-relaxed">
                                    &ldquo;{c.snippet}&rdquo;
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-10 h-10 rounded-xl bg-black text-[#ffe17c] border-2 border-black flex items-center justify-center font-black shrink-0 shadow-neo-sm">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#ffe17c] border-2 border-black flex items-center justify-center font-black text-black shrink-0 shadow-neo-sm animate-bounce">
                    <Zap className="w-5 h-5 fill-black" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-neo flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                    <span className="text-xs font-heading font-black uppercase tracking-wider text-black">
                      Retrieving Grounded Campus Facts with Gemma 4...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Query Input Box in Neo-Brutalist White & Black */}
        <div className="p-4 md:p-6 bg-[#ffe17c] border-t-2 border-black">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening... Speak your question aloud now...'
                    : 'Ask in English or Hinglish: "Agla hackathon kab hai?"...'
                }
                disabled={isLoading}
                className={`w-full bg-white text-black font-semibold text-sm md:text-base rounded-xl pl-4 pr-12 py-3.5 border-2 border-black shadow-neo focus:outline-none focus:ring-0 placeholder:text-black/50 ${
                  isListening ? 'border-red-600 bg-red-50 text-red-900 animate-pulse' : ''
                }`}
              />

              {/* Mic Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 p-2 rounded-lg border border-black transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-[#ffe17c] text-black hover:bg-black hover:text-[#ffe17c]'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak Question with Mic'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="neo-btn-primary px-6 py-3.5 !shadow-neo disabled:opacity-50 disabled:cursor-not-allowed hover:!shadow-neo-sm"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>

          <div className="max-w-4xl mx-auto mt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-black/70 px-1 gap-2">
            <div className="flex items-center gap-2">
              <span>Google Gemma 4 Grounding</span>
              <span>&bull;</span>
              <span>Bilingual English + Hinglish</span>
              <span>&bull;</span>
              <span>Web Speech Voice Input</span>
            </div>
            <button
              onClick={() => setIsIdeaGeneratorOpen(true)}
              className="text-black underline underline-offset-2 font-black uppercase flex items-center gap-1 hover:text-black/80"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Gemma 4 Project Suggestion Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
