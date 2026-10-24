import { NextRequest, NextResponse } from 'next/server';
import { deleteDocument, getDocumentById } from '@/lib/knowledge/store';

const EXPECTED_PASSCODE = process.env.TEAM_PASSCODE || 'pit2026';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const headerPasscode = req.headers.get('x-team-passcode') || '';
  const url = new URL(req.url);
  const urlPasscode = url.searchParams.get('passcode') || req.nextUrl?.searchParams?.get('passcode') || '';
  const candidate = (headerPasscode || urlPasscode).trim();

  if (candidate !== EXPECTED_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized: Invalid Team Passcode' }, { status: 401 });
  }

  const existing = getDocumentById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const success = deleteDocument(id);
  return NextResponse.json({ success, deletedId: id });
}
