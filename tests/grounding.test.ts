import { describe, it, expect } from 'vitest';
import { askGemmaAssistant } from '../src/lib/ai/gemma';
import { DocumentChunk } from '../src/types';

describe('Gemma AI Grounding & Local Mode Fallback', () => {
  const sampleChunks: DocumentChunk[] = [
    {
      chunkId: 'doc-1-c0',
      docId: 'doc-1',
      title: 'Hacktoberfest Hack Day Jaunpur',
      category: 'Hackathons',
      content: 'Hacktoberfest Hack Day Jaunpur takes place on Saturday, 24 October 2026 from 9:30 AM to 3:00 PM at Prasad Institute of Technology.',
      order: 0,
    },
  ];

  it('generates grounded preview with source citation when chunks are provided', async () => {
    const result = await askGemmaAssistant('When is the hackathon?', sampleChunks);
    expect(result.answer).toContain('24 October 2026');
    expect(result.answer).toContain('Prasad Institute of Technology');
    expect(result.citations.length).toBe(1);
    expect(result.citations[0].title).toBe('Hacktoberfest Hack Day Jaunpur');
  });

  it('refuses to hallucinate when zero chunks match the inquiry', async () => {
    const result = await askGemmaAssistant('Where can I get helicopter flying lessons?', []);
    expect(result.citations.length).toBe(0);
    expect(result.answer).toMatch(/could not find any official campus|not uploaded details/i);
    expect(result.answer).toContain('Student Welfare Desk');
  });
});
