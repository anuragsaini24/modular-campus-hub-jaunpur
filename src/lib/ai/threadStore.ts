import fs from 'fs';
import path from 'path';
import { ChatMessage, ChatThread } from '@/types';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const THREADS_DIR = path.join(DATA_DIR, 'threads');

function ensureDirectories() {
  if (!fs.existsSync(THREADS_DIR)) {
    fs.mkdirSync(THREADS_DIR, { recursive: true });
  }
}

function getThreadPath(id: string): string {
  // sanitize id
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(THREADS_DIR, `${safeId}.json`);
}

export function getAllThreads(): ChatThread[] {
  ensureDirectories();
  try {
    const files = fs.readdirSync(THREADS_DIR);
    const threads: ChatThread[] = [];
    for (const f of files) {
      if (f.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(THREADS_DIR, f), 'utf-8');
          threads.push(JSON.parse(content));
        } catch {
          // ignore corrupted single thread
        }
      }
    }
    threads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return threads;
  } catch (err) {
    console.error('Error reading threads:', err);
    return [];
  }
}

export function getThreadById(id: string): ChatThread | null {
  ensureDirectories();
  const filePath = getThreadPath(id);
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as ChatThread;
  } catch (err) {
    console.error(`Error reading thread ${id}:`, err);
    return null;
  }
}

export function saveThread(thread: ChatThread): ChatThread {
  ensureDirectories();
  const filePath = getThreadPath(thread.id);
  const updated: ChatThread = {
    ...thread,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function createThread(title = 'New Campus Inquiry', remoteThreadId?: string): ChatThread {
  const id = `thread-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const thread: ChatThread = {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
    remoteThreadId,
  };
  return saveThread(thread);
}

export function addMessageToThread(threadId: string, message: ChatMessage): ChatThread {
  let thread = getThreadById(threadId);
  if (!thread) {
    thread = createThread('Campus Chat');
    thread.id = threadId;
  }

  thread.messages.push(message);

  // If this is the first user message, update thread title from query
  if (message.role === 'user' && thread.messages.filter((m) => m.role === 'user').length === 1) {
    thread.title = message.content.slice(0, 45).trim() + (message.content.length > 45 ? '...' : '');
  }

  return saveThread(thread);
}

export function deleteThread(id: string): boolean {
  ensureDirectories();
  const filePath = getThreadPath(id);
  if (!fs.existsSync(filePath)) return false;
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (err) {
    console.error(`Error deleting thread ${id}:`, err);
    return false;
  }
}
