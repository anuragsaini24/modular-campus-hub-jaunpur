import { describe, it, expect } from 'vitest';
import { chunkDocument } from '../src/lib/knowledge/parser';
import { CampusDocument } from '../src/types';

describe('Document Parser and Semantic Chunker', () => {
  it('splits short document into a single cohesive chunk', () => {
    const doc: CampusDocument = {
      id: 'doc-test-1',
      title: 'Lab Access Notice',
      category: 'Academics',
      sourceType: 'markdown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: '# Lab Access\n\nComputer Lab 2 is open from 9 AM to 6 PM every weekday.',
    };

    const chunks = chunkDocument(doc);
    expect(chunks.length).toBe(1);
    expect(chunks[0].chunkId).toBe('doc-test-1-c0');
    expect(chunks[0].title).toBe('Lab Access Notice');
    expect(chunks[0].content).toContain('Computer Lab 2 is open');
  });

  it('splits long markdown document by headings and section boundaries', () => {
    const doc: CampusDocument = {
      id: 'doc-test-2',
      title: 'Multi-Section Handbook',
      category: 'Guidelines',
      sourceType: 'markdown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: `
# Section 1: Attendance Rules
Attendance must be strictly above 75 percent to be eligible for semester examination. Medical leaves must be submitted within 3 days.

# Section 2: Library Conduct
Silence must be maintained in the reading halls. Books can be checked out for a maximum of 14 days per renewal.

# Section 3: Canteen Regulations
The canteen is open from 8:30 AM to 5:30 PM. Digital payments via UPI are accepted at all food counters.
      `.trim(),
    };

    const chunks = chunkDocument(doc, 300, 50);
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks.some((c) => c.content.includes('Attendance must be strictly'))).toBe(true);
    expect(chunks.some((c) => c.content.includes('Library Conduct'))).toBe(true);
    expect(chunks.some((c) => c.content.includes('Canteen Regulations'))).toBe(true);
  });

  it('handles empty or whitespace-only documents safely', () => {
    const doc: CampusDocument = {
      id: 'doc-empty',
      title: 'Empty File',
      category: 'General',
      sourceType: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: '   \n\n   ',
    };

    const chunks = chunkDocument(doc);
    expect(chunks).toEqual([]);
  });
});
