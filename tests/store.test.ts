import { describe, it, expect } from 'vitest';
import { getDocuments, saveDocument, deleteDocument, getKnowledgeStats } from '../src/lib/knowledge/store';
import { CampusDocument } from '../src/types';

describe('Local Knowledge Store (Atomic SSD Storage)', () => {
  it('loads seed documents automatically on initial access', () => {
    const docs = getDocuments();
    expect(docs.length).toBeGreaterThanOrEqual(4);
    expect(docs.some((d) => d.title.includes('Hacktoberfest'))).toBe(true);
    expect(docs.some((d) => d.title.includes('Team Formation'))).toBe(true);
    expect(docs.some((d) => d.title.includes('Lost and Found'))).toBe(true);
  });

  it('persists a new document and produces chunks', () => {
    const testDoc: CampusDocument = {
      id: `doc-test-${Date.now()}`,
      title: 'Robotics Workshop Circular',
      category: 'Workshops',
      sourceType: 'markdown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: '# Robotics Workshop\nHeld in Electrical Lab 4 on 28 October 2026. Arduino kits provided.',
    };

    const { document: saved, chunks } = saveDocument(testDoc);
    expect(saved.id).toBe(testDoc.id);
    expect(saved.chunkCount).toBe(chunks.length);
    expect(chunks.length).toBeGreaterThan(0);

    const allDocs = getDocuments();
    expect(allDocs.some((d) => d.id === testDoc.id)).toBe(true);

    // Clean up
    const deleted = deleteDocument(testDoc.id);
    expect(deleted).toBe(true);
  });

  it('reports accurate knowledge statistics', () => {
    const stats = getKnowledgeStats();
    expect(stats.documentCount).toBeGreaterThan(0);
    expect(stats.chunkCount).toBeGreaterThan(0);
    expect(stats.categories.length).toBeGreaterThan(0);
  });
});
