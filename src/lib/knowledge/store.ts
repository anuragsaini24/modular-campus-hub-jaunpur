import fs from 'fs';
import path from 'path';
import { CampusDocument, DocumentChunk } from '@/types';
import { chunkDocument } from './parser';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const KNOWLEDGE_DIR = path.join(DATA_DIR, 'knowledge');
const SEED_FILE = path.join(DATA_DIR, 'seed', 'campus-knowledge.json');
const INDEX_FILE = path.join(KNOWLEDGE_DIR, 'index.json');
const CHUNKS_FILE = path.join(KNOWLEDGE_DIR, 'chunks.json');

function ensureDirectories() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  }
}

function initSeedIfEmpty() {
  ensureDirectories();
  const indexExists = fs.existsSync(INDEX_FILE);
  const chunksExists = fs.existsSync(CHUNKS_FILE);

  // If index does not exist at all, populate from seed
  if (!indexExists) {
    if (fs.existsSync(SEED_FILE)) {
      try {
        const seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8')) as CampusDocument[];
        const chunks: DocumentChunk[] = [];
        const docsWithChunkCount: CampusDocument[] = seedData.map((doc) => {
          const docChunks = chunkDocument(doc);
          chunks.push(...docChunks);
          return {
            ...doc,
            chunkCount: docChunks.length,
          };
        });

        fs.writeFileSync(INDEX_FILE, JSON.stringify(docsWithChunkCount, null, 2), 'utf-8');
        fs.writeFileSync(CHUNKS_FILE, JSON.stringify(chunks, null, 2), 'utf-8');
        return;
      } catch (err) {
        console.error('Error seeding campus knowledge:', err);
      }
    }
    fs.writeFileSync(INDEX_FILE, JSON.stringify([], null, 2), 'utf-8');
    fs.writeFileSync(CHUNKS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return;
  }

  // If index exists but chunks file is missing or empty, re-chunk from index documents (self-healing)
  if (!chunksExists || fs.readFileSync(CHUNKS_FILE, 'utf-8').trim() === '' || fs.readFileSync(CHUNKS_FILE, 'utf-8').trim() === '[]') {
    try {
      const rawIndex = fs.readFileSync(INDEX_FILE, 'utf-8').trim();
      const docs = JSON.parse(rawIndex || '[]') as CampusDocument[];
      if (docs.length > 0) {
        const chunks: DocumentChunk[] = [];
        docs.forEach((doc) => {
          chunks.push(...chunkDocument(doc));
        });
        fs.writeFileSync(CHUNKS_FILE, JSON.stringify(chunks, null, 2), 'utf-8');
      } else if (!chunksExists) {
        fs.writeFileSync(CHUNKS_FILE, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Error rebuilding chunks from index:', err);
    }
  }
}

export function getDocuments(): CampusDocument[] {
  initSeedIfEmpty();
  try {
    if (!fs.existsSync(INDEX_FILE)) return [];
    const content = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(content || '[]') as CampusDocument[];
  } catch (err) {
    console.error('Failed to read documents index:', err);
    return [];
  }
}

export function getDocumentById(id: string): CampusDocument | null {
  const docs = getDocuments();
  return docs.find((d) => d.id === id) || null;
}

export function getAllChunks(): DocumentChunk[] {
  initSeedIfEmpty();
  try {
    if (!fs.existsSync(CHUNKS_FILE)) return [];
    const content = fs.readFileSync(CHUNKS_FILE, 'utf-8');
    return JSON.parse(content || '[]') as DocumentChunk[];
  } catch (err) {
    console.error('Failed to read chunks store:', err);
    return [];
  }
}

export function saveDocument(doc: CampusDocument): { document: CampusDocument; chunks: DocumentChunk[] } {
  ensureDirectories();
  const docs = getDocuments();
  const existingIdx = docs.findIndex((d) => d.id === doc.id);

  const docChunks = chunkDocument(doc);
  const docToSave: CampusDocument = {
    ...doc,
    chunkCount: docChunks.length,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    docs[existingIdx] = docToSave;
  } else {
    docs.unshift(docToSave);
  }

  // Update chunks: remove old chunks for this doc, append new
  const allChunks = getAllChunks().filter((c) => c.docId !== doc.id);
  allChunks.push(...docChunks);

  fs.writeFileSync(INDEX_FILE, JSON.stringify(docs, null, 2), 'utf-8');
  fs.writeFileSync(CHUNKS_FILE, JSON.stringify(allChunks, null, 2), 'utf-8');

  return { document: docToSave, chunks: docChunks };
}

export function deleteDocument(id: string): boolean {
  ensureDirectories();
  const docs = getDocuments();
  const filteredDocs = docs.filter((d) => d.id !== id);
  if (filteredDocs.length === docs.length) return false;

  const chunks = getAllChunks().filter((c) => c.docId !== id);

  fs.writeFileSync(INDEX_FILE, JSON.stringify(filteredDocs, null, 2), 'utf-8');
  fs.writeFileSync(CHUNKS_FILE, JSON.stringify(chunks, null, 2), 'utf-8');

  return true;
}

export function getKnowledgeStats() {
  const docs = getDocuments();
  const chunks = getAllChunks();
  return {
    documentCount: docs.length,
    chunkCount: chunks.length,
    categories: Array.from(new Set(docs.map((d) => d.category))),
  };
}
