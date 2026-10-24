import { describe, it, expect, beforeAll } from 'vitest';
import { searchCampusKnowledge } from '../src/lib/knowledge/retriever';
import { getDocuments } from '../src/lib/knowledge/store';

describe('Real-World Student Query Variations', () => {
  beforeAll(() => {
    getDocuments();
  });

  it('handles "What should I do if I lose my phone?" -> Lost & Found', () => {
    const results = searchCampusKnowledge('What should I do if I lose my phone?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Lost & Found');
  });

  it('handles "Where is lunch served?" -> Hackathons schedule', () => {
    const results = searchCampusKnowledge('Where is lunch served?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.title).toContain('Hacktoberfest');
  });

  it('handles "Can I participate alone without teammates?" -> Project Teams', () => {
    const results = searchCampusKnowledge('Can I participate alone without teammates?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Project Teams');
  });

  it('handles "What are the Wi-Fi credentials?" -> Wi-Fi and Facilities', () => {
    const results = searchCampusKnowledge('What are the Wi-Fi credentials?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.title).toContain('Facilities');
  });

  it('handles "When does the library close?" -> Wi-Fi and Facilities', () => {
    const results = searchCampusKnowledge('When does the library close?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.title).toContain('Facilities');
  });

  it('handles "What is the team size limit?" -> Project Teams', () => {
    const results = searchCampusKnowledge('What is the team size limit?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Project Teams');
  });

  it('handles "Where can I submit a found item?" -> Lost & Found', () => {
    const results = searchCampusKnowledge('Where can I submit a found item?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Lost & Found');
  });

  it('handles "Who can I contact if I lose my ID card?" -> Lost & Found', () => {
    const results = searchCampusKnowledge('Who can I contact if I lose my ID card?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Lost & Found');
  });

  it('handles "What is the Wi-Fi network SSID?" -> Facilities', () => {
    const results = searchCampusKnowledge('What is the Wi-Fi network SSID?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Academics & Campus');
  });

  it('handles "Can solo participants join the hackathon?" -> Project Teams or Hackathons', () => {
    const results = searchCampusKnowledge('Can solo participants join the hackathon?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(['Project Teams', 'Hackathons']).toContain(results[0].chunk.category);
  });

  it('handles Hinglish query "Agla hackathon kab aur kahan hai?" -> Hackathons', () => {
    const results = searchCampusKnowledge('Agla hackathon kab aur kahan hai?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.title).toContain('Hacktoberfest');
  });

  it('handles Hinglish query "Mera batua kho gaya kahan report karein?" -> Lost & Found', () => {
    const results = searchCampusKnowledge('Mera batua kho gaya kahan report karein?', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.category).toBe('Lost & Found');
  });
});
