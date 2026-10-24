import { Citation, DocumentChunk, GroundingMode } from '@/types';

const SYSTEM_PROMPT = `You are the official AI College Assistant for Prasad Institute of Technology (PIT Jaunpur).
CRITICAL GROUNDING RULES:
1. Answer ONLY using facts present in the <CAMPUS_KNOWLEDGE> blocks provided below.
2. Cite the exact source title(s) inline like [Source: <Title>].
3. If the answer is NOT contained in <CAMPUS_KNOWLEDGE>, clearly state that the campus team has not uploaded information on that topic yet and suggest visiting the Student Welfare Desk in Block A (Ground Floor). Never invent dates, room numbers, Wi-Fi credentials, or policies.
4. Keep answers friendly, well-structured with bullet points, and directly actionable for students.
5. If the student inquires in Hindi or Hinglish (e.g. "Agla hackathon kab hai?", "Team kaise banayein?"), respond in courteous, easy-to-understand Hinglish or English with full verified source citations.`;

export interface GemmaAnswerResult {
  answer: string;
  citations: Citation[];
  mode: GroundingMode;
  modelUsed: string;
}

/**
 * Deterministic local grounded answering when GEMINI_API_KEY is not configured or rate-limited
 */
function formatSnippet(content: string, maxLen = 220): string {
  const clean = content.replace(/^#+\s+/gm, '').replace(/\n+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const breakPoint = clean.lastIndexOf('. ', maxLen);
  if (breakPoint > maxLen * 0.5) {
    return clean.slice(0, breakPoint + 1);
  }
  return clean.slice(0, maxLen).trim() + '...';
}

function generateLocalGroundedAnswer(query: string, retrievedChunks: DocumentChunk[]): GemmaAnswerResult {
  const citations: Citation[] = retrievedChunks.map((c, i) => ({
    docId: c.docId,
    title: c.title,
    category: c.category,
    snippet: formatSnippet(c.content, 180),
    score: 1.0 - i * 0.1,
  }));

  if (retrievedChunks.length === 0) {
    return {
      answer: `I could not find any official campus records or uploaded notices regarding **"${query}"** in the Prasad Institute of Technology knowledge base.\n\nPlease visit the **Student Welfare Desk (SWD)** on the Ground Floor of Administrative Block A (opposite Room A-104) or email lostfound@prasad.edu.in for assistance.`,
      citations: [],
      mode: 'local-preview',
      modelUsed: 'Local Grounded Engine ($0 Free Tier)',
    };
  }

  // Generate a structured, human-readable grounded answer from retrieved chunks
  const bulletPoints = retrievedChunks
    .map((c) => {
      const excerpt = formatSnippet(c.content, 320);
      return `• **${c.title}** (${c.category}):\n  ${excerpt} [Source: ${c.title}]`;
    })
    .join('\n\n');

  const answer = `Based on verified PIT Jaunpur campus records:\n\n${bulletPoints}\n\n*(Grounded via local retrieval. For live neural Gemma 4 inference, add a free GEMINI_API_KEY from Google AI Studio in .env.local)*`;

  return {
    answer,
    citations,
    mode: 'local-preview',
    modelUsed: 'Local Grounded Engine ($0 Free Tier)',
  };
}

export async function askGemmaAssistant(
  query: string,
  retrievedChunks: DocumentChunk[]
): Promise<GemmaAnswerResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  const citations: Citation[] = retrievedChunks.map((c, i) => ({
    docId: c.docId,
    title: c.title,
    category: c.category,
    snippet: c.content.slice(0, 180) + '...',
    score: 1.0 - i * 0.1,
  }));

  // If no chunks matched query, decline safely without calling LLM
  if (retrievedChunks.length === 0) {
    return {
      answer: `I could not find any official campus notices or documentation matching your inquiry: **"${query}"**.\n\nThe campus team has not uploaded details for this topic yet. For unlisted inquiries, please visit the **Student Welfare Desk** (Block A Ground Floor) or check with the event coordinators at Prasad Institute of Technology.`,
      citations: [],
      mode: 'local-preview',
      modelUsed: 'Safety Grounding Filter',
    };
  }

  // If no API key is provided, use high-fidelity Local Grounded Engine
  if (!apiKey || apiKey.trim() === '') {
    return generateLocalGroundedAnswer(query, retrievedChunks);
  }

  // Build context block
  const knowledgeBlock = retrievedChunks
    .map((c, i) => `[Source ${i + 1}: ${c.title} | Category: ${c.category}]\n${c.content}`)
    .join('\n\n---\n\n');

  const userPrompt = `<CAMPUS_KNOWLEDGE>\n${knowledgeBlock}\n</CAMPUS_KNOWLEDGE>\n\nStudent Question: "${query}"\n\nPlease provide a direct, helpful, grounded answer following all grounding rules and citing sources.`;

  // Dynamically import @google/genai to avoid build issues if not ready
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // Try primary Gemma 4 model
    try {
      const response = await ai.models.generateContent({
        model: 'gemma-4-31b-it',
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });

      const text = response?.text || '';
      if (text.trim()) {
        return {
          answer: text,
          citations,
          mode: 'gemma-4-31b-it',
          modelUsed: 'Google Gemma 4 (31B-IT Free Tier)',
        };
      }
    } catch (gemma31Err) {
      console.warn('Gemma 4 31B-IT fallback to 26B-A4B-IT:', gemma31Err);

      // Try fallback model gemma-4-26b-a4b-it or gemini-2.5-flash
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemma-4-26b-a4b-it',
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
          },
        });

        const text = fallbackResponse?.text || '';
        if (text.trim()) {
          return {
            answer: text,
            citations,
            mode: 'gemma-4-26b-a4b-it',
            modelUsed: 'Google Gemma 4 (26B-A4B-IT Free Tier)',
          };
        }
      } catch (gemma26Err) {
        console.warn('Gemma 4 26B-A4B fallback to gemini-2.5-flash:', gemma26Err);
        const flashResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
          },
        });
        const text = flashResponse?.text || '';
        if (text.trim()) {
          return {
            answer: text,
            citations,
            mode: 'gemma-4-31b-it',
            modelUsed: 'Google AI Studio (Gemini 2.5 Flash Fallback)',
          };
        }
      }
    }
  } catch (sdkErr) {
    console.error('Google GenAI error, falling back to local grounded preview:', sdkErr);
  }

  // Graceful fallback to deterministic local grounded preview
  return generateLocalGroundedAnswer(query, retrievedChunks);
}
