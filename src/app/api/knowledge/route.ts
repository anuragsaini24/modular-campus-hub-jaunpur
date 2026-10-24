import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, saveDocument } from '@/lib/knowledge/store';
import { extractTextFromPdf } from '@/lib/knowledge/parser';
import { backboardClient } from '@/lib/ai/backboard';
import { CampusDocument } from '@/types';

const EXPECTED_PASSCODE = process.env.TEAM_PASSCODE || 'pit2026';

function verifyPasscode(req: NextRequest, bodyPasscode?: string): boolean {
  const headerPasscode = req.headers.get('x-team-passcode');
  const candidate = (headerPasscode || bodyPasscode || '').trim();
  return candidate === EXPECTED_PASSCODE;
}

export async function GET() {
  const docs = getDocuments();
  return NextResponse.json({
    documents: docs,
    total: docs.length,
  });
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  let title = '';
  let category = 'Academics & Campus';
  let content = '';
  let sourceType: 'markdown' | 'pdf' | 'text' = 'markdown';
  let passcode = '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    passcode = (formData.get('passcode') as string) || '';

    if (!verifyPasscode(req, passcode)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Team Passcode' },
        { status: 401 }
      );
    }

    const file = formData.get('file') as File | null;
    category = (formData.get('category') as string) || 'Academics & Campus';
    const formTitle = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form-data' }, { status: 400 });
    }

    title = formTitle || file.name.replace(/\.[^/.]+$/, '');
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      sourceType = 'pdf';
      const buffer = await file.arrayBuffer();
      content = await extractTextFromPdf(buffer);
    } else if (fileName.endsWith('.md')) {
      sourceType = 'markdown';
      content = await file.text();
    } else {
      sourceType = 'text';
      content = await file.text();
    }
  } else {
    // JSON Payload
    const body = await req.json();
    passcode = body.passcode || '';

    if (!verifyPasscode(req, passcode)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Team Passcode' },
        { status: 401 }
      );
    }

    title = body.title || 'Untitled Notice';
    category = body.category || 'Academics & Campus';
    content = body.content || '';
    sourceType = body.sourceType || 'markdown';
  }

  if (!content.trim()) {
    return NextResponse.json(
      { error: 'Document content is empty or could not be parsed.' },
      { status: 400 }
    );
  }

  const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const doc: CampusDocument = {
    id,
    title,
    category,
    sourceType,
    createdAt: now,
    updatedAt: now,
    content,
  };

  const { document: savedDoc, chunks } = saveDocument(doc);

  // Sync to Backboard if configured
  if (backboardClient.isConfigured()) {
    backboardClient.syncDocument(savedDoc.title, savedDoc.content, savedDoc.category).catch((err) => {
      console.warn('Backboard sync error in background:', err);
    });
  }

  return NextResponse.json({
    success: true,
    document: savedDoc,
    chunkCount: chunks.length,
  });
}
