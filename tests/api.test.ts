import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as healthGet } from '../src/app/api/health/route';
import { POST as chatPost } from '../src/app/api/assistant/chat/route';
import { GET as knowledgeGet, POST as knowledgePost } from '../src/app/api/knowledge/route';
import { DELETE as knowledgeDelete } from '../src/app/api/knowledge/[id]/route';
import { GET as threadsGet, POST as threadsPost, DELETE as threadsDelete } from '../src/app/api/assistant/threads/route';
import { GET as settingsKeyGet, POST as settingsKeyPost } from '../src/app/api/settings/key/route';
import { POST as ideasPost } from '../src/app/api/assistant/ideas/route';
import { getDocuments } from '../src/lib/knowledge/store';

describe('Campus Hub Backend API Integration', () => {
  beforeAll(() => {
    getDocuments();
  });

  describe('GET /api/health', () => {
    it('returns healthy status and D: drive storage isolation information', async () => {
      const res = await healthGet();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('healthy');
      expect(data.appName).toContain('Modular Campus Hub');
      expect(data.documentCount).toBeGreaterThanOrEqual(4);
      expect(data.chunkCount).toBeGreaterThan(0);
      expect(data.storage.hostDrive).toBe('D:');
      expect(data.storage.strictExternalSSD).toBe(true);
    });
  });

  describe('POST /api/assistant/chat', () => {
    it('rejects empty queries with HTTP 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '   ' }),
      });
      const res = await chatPost(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('cannot be empty');
    });

    it('returns grounded response for "When is the next hackathon?" with citations', async () => {
      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'When is the next hackathon?' }),
      });
      const res = await chatPost(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.threadId).toBeDefined();
      expect(data.assistantMessage).toBeDefined();
      expect(data.assistantMessage.content).toContain('24 October 2026');
      expect(data.assistantMessage.citations.length).toBeGreaterThan(0);
      expect(data.assistantMessage.citations[0].title).toContain('Hacktoberfest');
      expect(data.retrievalScore).toBeGreaterThan(2.0);
    });

    it('returns defensive safety refusal for out-of-domain query', async () => {
      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'What are the swimming pool timings?' }),
      });
      const res = await chatPost(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.retrievalScore).toBe(0);
      expect(data.assistantMessage.citations.length).toBe(0);
      expect(data.assistantMessage.content).toMatch(/could not find any official campus|not uploaded details/i);
    });
  });

  describe('Knowledge Lifecycle: POST & DELETE /api/knowledge', () => {
    it('rejects publishing without passcode or invalid passcode with HTTP 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Unauthorized Notice',
          content: 'Test content',
          passcode: 'wrongpass',
        }),
      });
      const res = await knowledgePost(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('publishes a new notice with valid passcode pit2026 and deletes it', async () => {
      const title = `Campus Blood Donation Camp ${Date.now()}`;
      const content = 'The annual Red Cross Blood Donation Camp takes place at Seminar Hall Block B on 5 November 2026.';

      const postReq = new NextRequest('http://localhost:3000/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-team-passcode': 'pit2026',
        },
        body: JSON.stringify({
          title,
          category: 'Academics & Campus',
          content,
          passcode: 'pit2026',
        }),
      });

      const postRes = await knowledgePost(postReq);
      expect(postRes.status).toBe(200);
      const postData = await postRes.json();
      expect(postData.success).toBe(true);
      expect(postData.document.title).toBe(title);
      const docId = postData.document.id;

      // Verify immediate listing
      const listRes = await knowledgeGet();
      const listData = await listRes.json();
      expect(listData.documents.some((d: any) => d.id === docId)).toBe(true);

      // Verify chat can retrieve from newly published notice
      const chatReq = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'When is the blood donation camp?' }),
      });
      const chatRes = await chatPost(chatReq);
      const chatData = await chatRes.json();
      expect(chatData.assistantMessage.content).toContain('5 November 2026');

      // Delete the document
      const delReq = new NextRequest(`http://localhost:3000/api/knowledge/${docId}?passcode=pit2026`, {
        method: 'DELETE',
        headers: { 'x-team-passcode': 'pit2026' },
      });
      const delRes = await knowledgeDelete(delReq, { params: Promise.resolve({ id: docId }) });
      expect(delRes.status).toBe(200);
      const delData = await delRes.json();
      expect(delData.success).toBe(true);
    });
  });

  describe('/api/assistant/threads', () => {
    it('creates, reads, and deletes persistent threads', async () => {
      // Create thread
      const postReq = new NextRequest('http://localhost:3000/api/assistant/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Integration Test Thread' }),
      });
      const postRes = await threadsPost(postReq);
      expect(postRes.status).toBe(200);
      const thread = await postRes.json();
      expect(thread.id).toBeDefined();

      // Read single thread
      const getSingleReq = new NextRequest(`http://localhost:3000/api/assistant/threads?id=${thread.id}`);
      const getSingleRes = await threadsGet(getSingleReq);
      expect(getSingleRes.status).toBe(200);
      const fetched = await getSingleRes.json();
      expect(fetched.id).toBe(thread.id);

      // Delete thread
      const delReq = new NextRequest(`http://localhost:3000/api/assistant/threads?id=${thread.id}`, {
        method: 'DELETE',
      });
      const delRes = await threadsDelete(delReq);
      expect(delRes.status).toBe(200);
      const delData = await delRes.json();
      expect(delData.success).toBe(true);
    });
  });

  describe('/api/settings/key', () => {
    it('returns API key configuration status', async () => {
      const res = await settingsKeyGet();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('gemmaConfigured');
      expect(data).toHaveProperty('backboardConfigured');
      expect(data).toHaveProperty('activeModel');
    });

    it('handles setting and verifying keys safely without crashing', async () => {
      const req = new NextRequest('http://localhost:3000/api/settings/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: '',
          backboardApiKey: '',
        }),
      });
      const res = await settingsKeyPost(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/assistant/ideas', () => {
    it('generates 3 grounded hackathon project proposals matching MLH tracks', async () => {
      const req = new NextRequest('http://localhost:3000/api/assistant/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: 'Google Gemma Challenge',
          skills: ['Google Gemma 4', 'Next.js 15', 'Arduino'],
          teamSize: 3,
        }),
      });
      const res = await ideasPost(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.suggestions.length).toBe(3);
      expect(data.suggestions[0]).toHaveProperty('title');
      expect(data.suggestions[0]).toHaveProperty('sixHourRoadmap');
      expect(data.suggestions[0]).toHaveProperty('judgePitchAngle');
    });
  });
});
