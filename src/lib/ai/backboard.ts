const BACKBOARD_BASE_URL = 'https://app.backboard.io/api';

export class BackboardClient {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.BACKBOARD_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Creates a persistent remote thread on Backboard
   */
  async createRemoteThread(assistantId?: string): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const res = await fetch(`${BACKBOARD_BASE_URL}/threads`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          assistant_id: assistantId,
          metadata: { app: 'pit-campus-hub', timestamp: new Date().toISOString() },
        }),
      });

      if (!res.ok) {
        console.warn(`Backboard createRemoteThread returned ${res.status}`);
        return null;
      }

      const data = await res.json();
      return data.id || data.thread_id || null;
    } catch (err) {
      console.warn('Backboard createRemoteThread error (fallback to local):', err);
      return null;
    }
  }

  /**
   * Syncs a message to Backboard remote thread
   */
  async syncMessage(threadId: string, role: 'user' | 'assistant', content: string): Promise<boolean> {
    if (!this.isConfigured() || !threadId) return false;

    try {
      const res = await fetch(`${BACKBOARD_BASE_URL}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          role,
          content,
        }),
      });
      return res.ok;
    } catch (err) {
      console.warn('Backboard syncMessage error:', err);
      return false;
    }
  }

  /**
   * Uploads or syncs document knowledge to Backboard
   */
  async syncDocument(title: string, content: string, category: string): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const res = await fetch(`${BACKBOARD_BASE_URL}/documents`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title,
          content,
          metadata: { category, institution: 'Prasad Institute of Technology' },
        }),
      });

      if (!res.ok) {
        console.warn(`Backboard syncDocument returned status ${res.status}`);
        return null;
      }

      const data = await res.json();
      return data.id || null;
    } catch (err) {
      console.warn('Backboard syncDocument error:', err);
      return null;
    }
  }
}

export const backboardClient = new BackboardClient();
