import { CampusDocument, DocumentChunk } from '@/types';

/**
 * Extracts raw text from a PDF ArrayBuffer or Uint8Array using unpdf
 */
export async function extractTextFromPdf(data: ArrayBuffer | Uint8Array): Promise<string> {
  try {
    const { extractText } = await import('unpdf');
    const result = await extractText(data);
    const rawText = result?.text as unknown;

    if (Array.isArray(rawText)) {
      return (rawText as string[]).join('\n\n').trim();
    }
    if (typeof rawText === 'string') {
      return (rawText as string).trim();
    }
    return '';
  } catch (err) {
    console.error('Failed to parse PDF using unpdf:', err);
    throw new Error('Could not parse PDF content. Please check file format.');
  }
}

/**
 * Splits document content into semantic, bounded chunks for hybrid retrieval
 */
export function chunkDocument(doc: CampusDocument, maxChunkSize = 700, overlap = 80): DocumentChunk[] {
  const text = (doc.content || '').trim();
  if (!text) return [];

  // Split by markdown headings or paragraphs
  const rawParagraphs = text
    .split(/\n(?=#{1,4}\s)|\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const mergedSections: string[] = [];
  let currentBuffer = '';
  const minSplitThreshold = Math.max(Math.floor(maxChunkSize * 0.45), 140);

  for (const p of rawParagraphs) {
    const isHeading = /^#{1,3}\s/.test(p);

    if (!currentBuffer) {
      currentBuffer = p;
    } else if (isHeading && currentBuffer.length >= minSplitThreshold) {
      mergedSections.push(currentBuffer);
      currentBuffer = p;
    } else if (currentBuffer.length + p.length + 2 <= maxChunkSize) {
      currentBuffer += '\n\n' + p;
    } else {
      mergedSections.push(currentBuffer);
      currentBuffer = p;
    }
  }

  if (currentBuffer) {
    mergedSections.push(currentBuffer);
  }

  const chunks: DocumentChunk[] = [];
  let chunkIndex = 0;

  for (const section of mergedSections) {
    if (section.length <= maxChunkSize) {
      chunks.push({
        chunkId: `${doc.id}-c${chunkIndex++}`,
        docId: doc.id,
        title: doc.title,
        category: doc.category,
        content: section,
        order: chunkIndex,
      });
    } else {
      let start = 0;
      while (start < section.length) {
        let end = Math.min(start + maxChunkSize, section.length);

        if (end < section.length) {
          const lastPeriod = section.lastIndexOf('. ', end);
          const lastNewline = section.lastIndexOf('\n', end);
          const breakPoint = Math.max(lastPeriod, lastNewline);
          if (breakPoint > start + maxChunkSize * 0.5) {
            end = breakPoint + 1;
          }
        }

        const chunkText = section.substring(start, end).trim();
        if (chunkText.length > 20) {
          chunks.push({
            chunkId: `${doc.id}-c${chunkIndex++}`,
            docId: doc.id,
            title: doc.title,
            category: doc.category,
            content: chunkText,
            order: chunkIndex,
          });
        }

        if (end >= section.length) break;
        start = Math.max(end - overlap, start + 1);
      }
    }
  }

  return chunks;
}
