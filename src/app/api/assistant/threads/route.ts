import { NextRequest, NextResponse } from 'next/server';
import { createThread, deleteThread, getAllThreads, getThreadById } from '@/lib/ai/threadStore';
import { backboardClient } from '@/lib/ai/backboard';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const thread = getThreadById(id);
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }
    return NextResponse.json(thread);
  }

  const threads = getAllThreads();
  return NextResponse.json({ threads, total: threads.length });
}

export async function POST(req: NextRequest) {
  let title = 'New Campus Inquiry';
  try {
    const body = await req.json();
    if (body.title) title = body.title;
  } catch {
    // Body is optional
  }

  // Create remote Backboard thread if enabled
  let remoteThreadId: string | undefined;
  if (backboardClient.isConfigured()) {
    const rId = await backboardClient.createRemoteThread();
    if (rId) remoteThreadId = rId;
  }

  const thread = createThread(title, remoteThreadId);
  return NextResponse.json(thread);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing thread id' }, { status: 400 });
  }

  const success = deleteThread(id);
  return NextResponse.json({ success, deletedId: id });
}
