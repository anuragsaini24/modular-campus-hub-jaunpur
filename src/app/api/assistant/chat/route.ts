import { NextRequest, NextResponse } from 'next/server';
import { searchCampusKnowledge } from '@/lib/knowledge/retriever';
import { askGemmaAssistant } from '@/lib/ai/gemma';
import { addMessageToThread, createThread, getThreadById } from '@/lib/ai/threadStore';
import { backboardClient } from '@/lib/ai/backboard';
import { ChatMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    let threadId = (body.threadId || '').trim();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter cannot be empty' }, { status: 400 });
    }

    // Ensure thread exists
    let thread = threadId ? getThreadById(threadId) : null;
    if (!thread) {
      let remoteThreadId: string | undefined;
      if (backboardClient.isConfigured()) {
        const rId = await backboardClient.createRemoteThread();
        if (rId) remoteThreadId = rId;
      }
      thread = createThread('Campus Chat', remoteThreadId);
      threadId = thread.id;
    }

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: query,
      createdAt: now,
    };

    addMessageToThread(threadId, userMessage);

    // Sync user message to Backboard
    if (backboardClient.isConfigured() && thread.remoteThreadId) {
      backboardClient.syncMessage(thread.remoteThreadId, 'user', query).catch(() => {});
    }

    // Hybrid Grounded Retrieval
    const searchResults = searchCampusKnowledge(query, 3, 1.0);
    const retrievedChunks = searchResults.map((r) => r.chunk);
    const topScore = searchResults.length > 0 ? searchResults[0].score : 0;

    // Grounded Gemma Answering
    const gemmaResult = await askGemmaAssistant(query, retrievedChunks);

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: gemmaResult.answer,
      createdAt: new Date().toISOString(),
      citations: gemmaResult.citations,
      groundingMode: gemmaResult.mode,
      modelUsed: gemmaResult.modelUsed,
      retrievalScore: topScore,
    };

    const updatedThread = addMessageToThread(threadId, assistantMessage);

    // Sync assistant message to Backboard
    if (backboardClient.isConfigured() && thread.remoteThreadId) {
      backboardClient.syncMessage(thread.remoteThreadId, 'assistant', gemmaResult.answer).catch(() => {});
    }

    return NextResponse.json({
      threadId,
      thread: updatedThread,
      userMessage,
      assistantMessage,
      retrievedChunks,
      retrievalScore: topScore,
    });
  } catch (err: any) {
    console.error('Error in chat API route:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error processing student inquiry' },
      { status: 500 }
    );
  }
}
