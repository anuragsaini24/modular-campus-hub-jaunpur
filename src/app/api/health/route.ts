import { NextResponse } from 'next/server';
import { getKnowledgeStats } from '@/lib/knowledge/store';
import { backboardClient } from '@/lib/ai/backboard';

export async function GET() {
  const stats = getKnowledgeStats();
  const gemmaConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const backboardConfigured = backboardClient.isConfigured();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    appName: 'Modular Campus Hub — PIT Jaunpur',
    version: '1.0.0',
    documentCount: stats.documentCount,
    chunkCount: stats.chunkCount,
    categories: stats.categories,
    gemmaConfigured,
    backboardConfigured,
    storage: {
      directory: process.env.DATA_DIR || './data',
      strictExternalSSD: true,
      hostDrive: 'D:',
    },
  });
}
