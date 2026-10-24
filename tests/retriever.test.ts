import { describe, it, expect, beforeAll } from 'vitest';
import { searchCampusKnowledge } from '../src/lib/knowledge/retriever';
import { getDocuments } from '../src/lib/knowledge/store';

describe('Campus Hybrid Retriever', () => {
  beforeAll(() => {
    // Ensures seed data is loaded into memory/store
    getDocuments();
  });

  it('retrieves Hacktoberfest details for "When is the next hackathon?"', () => {
    const results = searchCampusKnowledge('When is the next hackathon?', 3);
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.chunk.title).toContain('Hacktoberfest');
    expect(topResult.score).toBeGreaterThan(2.0);
    expect(topResult.chunk.content).toContain('24 October 2026');
  });

  it('retrieves team formation protocol for "How do I join a project team?"', () => {
    const results = searchCampusKnowledge('How do I join a project team?', 3);
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.chunk.title).toContain('Project Team');
    expect(topResult.score).toBeGreaterThan(2.0);
    expect(topResult.chunk.content).toMatch(/1 to 4 members|Discord|Matchmaking/i);
  });

  it('retrieves lost & found protocol for "Where do I report a lost item?"', () => {
    const results = searchCampusKnowledge('Where do I report a lost item?', 3);
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.chunk.title).toContain('Lost and Found');
    expect(topResult.score).toBeGreaterThan(2.0);
    expect(topResult.chunk.content).toContain('Student Welfare Desk');
    expect(topResult.chunk.content).toContain('Block A');
  });

  it('matches domain synonyms for "misplaced my wallet"', () => {
    const results = searchCampusKnowledge('misplaced my wallet', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.title).toContain('Lost and Found');
  });

  it('matches domain synonyms for "squad partner"', () => {
    const results = searchCampusKnowledge('squad partner for coding', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Project Teams');
  });

  it('safely rejects completely out-of-domain questions with 0 results', () => {
    const results = searchCampusKnowledge('What is the schedule of the campus swimming pool and scuba diving?', 3, 2.0);
    expect(results.length).toBe(0);
  });
});
