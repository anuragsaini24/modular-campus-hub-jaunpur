export type SourceType = 'markdown' | 'pdf' | 'text';

export interface CampusDocument {
  id: string;
  title: string;
  category: string;
  sourceType: SourceType;
  createdAt: string;
  updatedAt: string;
  content: string;
  chunkCount?: number;
}

export interface DocumentChunk {
  chunkId: string;
  docId: string;
  title: string;
  category: string;
  content: string;
  order: number;
}

export interface Citation {
  docId: string;
  title: string;
  category: string;
  snippet: string;
  score: number;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
  highlightWords: string[];
}

export type GroundingMode = 'gemma-4-31b-it' | 'gemma-4-26b-a4b-it' | 'local-preview';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  citations?: Citation[];
  groundingMode?: GroundingMode;
  modelUsed?: string;
  retrievalScore?: number;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  remoteThreadId?: string; // Backboard persistent thread ID
}

export interface FeatureModule {
  id: string;
  name: string;
  badge: string;
  href: string;
  description: string;
  status: 'active' | 'coming-soon' | 'planned';
  iconName: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded';
  timestamp: string;
  appName: string;
  version: string;
  documentCount: number;
  chunkCount: number;
  gemmaConfigured: boolean;
  backboardConfigured: boolean;
  storage: {
    directory: string;
    strictExternalSSD: boolean;
  };
}
