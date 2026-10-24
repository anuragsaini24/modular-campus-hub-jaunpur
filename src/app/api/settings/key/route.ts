import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

export async function GET() {
  const gemmaKey = process.env.GEMINI_API_KEY || '';
  const backboardKey = process.env.BACKBOARD_API_KEY || '';

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return null;
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  };

  return NextResponse.json({
    gemmaConfigured: Boolean(gemmaKey && gemmaKey.trim().length > 0),
    gemmaKeyMasked: maskKey(gemmaKey),
    backboardConfigured: Boolean(backboardKey && backboardKey.trim().length > 0),
    backboardKeyMasked: maskKey(backboardKey),
    activeModel: gemmaKey ? 'Google Gemma 4 (31B-IT)' : 'Local Grounded Engine ($0 Free Tier)',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { geminiApiKey, backboardApiKey } = body;

    let gemmaStatus = 'unchanged';
    let gemmaError = null;
    let backboardStatus = 'unchanged';

    // Verify Gemma API Key if provided
    if (typeof geminiApiKey === 'string') {
      const trimmed = geminiApiKey.trim();
      if (trimmed === '') {
        delete process.env.GEMINI_API_KEY;
        gemmaStatus = 'cleared';
      } else {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: trimmed });

          // Test lightweight model check
          await ai.models.generateContent({
            model: 'gemma-4-31b-it',
            contents: 'Hello! Respond with "OK"',
            config: { maxOutputTokens: 5 },
          });

          process.env.GEMINI_API_KEY = trimmed;
          gemmaStatus = 'verified';
        } catch (err: any) {
          // If 31b is rate-limited or fails, test fallback
          try {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: trimmed });
            await ai.models.generateContent({
              model: 'gemma-4-26b-a4b-it',
              contents: 'Hello! Respond with "OK"',
              config: { maxOutputTokens: 5 },
            });
            process.env.GEMINI_API_KEY = trimmed;
            gemmaStatus = 'verified-fallback';
          } catch (fallbackErr: any) {
            console.error('API Key Verification failed:', fallbackErr);
            gemmaError = fallbackErr?.message || 'Invalid Google AI Studio Key or network error.';
            // Set anyway if user insists, but record error
            process.env.GEMINI_API_KEY = trimmed;
            gemmaStatus = 'saved-unverified';
          }
        }
      }
    }

    // Verify Backboard API Key if provided
    if (typeof backboardApiKey === 'string') {
      const trimmedBb = backboardApiKey.trim();
      if (trimmedBb === '') {
        delete process.env.BACKBOARD_API_KEY;
        backboardStatus = 'cleared';
      } else {
        process.env.BACKBOARD_API_KEY = trimmedBb;
        backboardStatus = 'saved';
      }
    }

    // Persist to .env.local file
    try {
      let envContent = '';
      if (fs.existsSync(ENV_LOCAL_PATH)) {
        envContent = fs.readFileSync(ENV_LOCAL_PATH, 'utf-8');
      }

      const updateOrAppend = (content: string, key: string, value: string | undefined) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (value && value.trim() !== '') {
          if (regex.test(content)) {
            return content.replace(regex, `${key}=${value.trim()}`);
          }
          return `${content.trim()}\n${key}=${value.trim()}\n`;
        } else {
          return content.replace(regex, '').replace(/\n\n+/g, '\n');
        }
      };

      if (typeof geminiApiKey === 'string') {
        envContent = updateOrAppend(envContent, 'GEMINI_API_KEY', geminiApiKey);
      }
      if (typeof backboardApiKey === 'string') {
        envContent = updateOrAppend(envContent, 'BACKBOARD_API_KEY', backboardApiKey);
      }

      if (!envContent.includes('TEAM_PASSCODE=')) {
        envContent += 'TEAM_PASSCODE=pit2026\n';
      }
      if (!envContent.includes('DATA_DIR=')) {
        envContent += 'DATA_DIR=./data\n';
      }
      if (!envContent.includes('NEXT_TELEMETRY_DISABLED=')) {
        envContent += 'NEXT_TELEMETRY_DISABLED=1\n';
      }

      fs.writeFileSync(ENV_LOCAL_PATH, envContent.trim() + '\n', 'utf-8');
    } catch (fsErr) {
      console.warn('Could not persist to .env.local:', fsErr);
    }

    return NextResponse.json({
      success: true,
      gemmaStatus,
      gemmaError,
      backboardStatus,
      message:
        gemmaStatus === 'verified'
          ? '✓ Google Gemma 4 (31B-IT) is verified and live!'
          : gemmaStatus === 'verified-fallback'
          ? '✓ Google Gemma 4 (26B-A4B-IT) is verified and live!'
          : gemmaStatus === 'saved-unverified'
          ? `Key saved (${gemmaError || 'Verification notice'}).`
          : 'Settings updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update settings.' },
      { status: 500 }
    );
  }
}
