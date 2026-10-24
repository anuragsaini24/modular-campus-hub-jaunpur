import { DocumentChunk, RetrievalResult } from '@/types';
import { getAllChunks } from './store';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'also', 'am', 'an', 'and', 'any',
  'anyone', 'anything', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'by', 'can', 'cannot', 'check', 'could', 'did', 'do', 'does', 'doing',
  'down', 'during', 'each', 'few', 'find', 'for', 'from', 'further', 'get', 'give', 'go',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'i', 'if', 'in', 'into', 'is', 'it', 'item', 'items', 'its', 'itself',
  'just', 'know', 'like', 'many', 'me', 'more', 'most', 'much', 'my', 'myself', 'need', 'no',
  'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'please', 'same', 'she', 'should', 'show', 'so',
  'some', 'someone', 'something', 'such', 'tell', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'thing', 'things', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'want', 'was', 'we', 'were',
  'which', 'while', 'whom', 'will', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves',
]);

const GENERIC_CAMPUS_TERMS = new Set([
  'campus', 'college', 'pit', 'prasad', 'jaunpur', 'institute', 'technology', 'student',
  'students', 'details', 'info', 'information', 'official',
]);

const TEMPORAL_TERMS = new Set([
  'when', 'date', 'dates', 'time', 'timing', 'timings', 'schedule', 'hours', 'day', 'days',
  'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'october',
  'month', 'year', 'morning', 'afternoon', 'evening', 'night', 'start', 'starts', 'end',
  'ends', 'open', 'close', 'next', 'timeline', 'agenda',
]);

const LOCATION_TERMS = new Set([
  'where', 'location', 'venue', 'place', 'address', 'room', 'block', 'floor', 'desk',
  'office', 'center', 'hall', 'building',
]);

const ACTION_TERMS = new Set([
  'how', 'procedure', 'process', 'step', 'steps', 'protocol', 'rule', 'rules',
  'guideline', 'guidelines', 'policy', 'instructions',
]);

const CONTACT_TERMS = new Set([
  'who', 'contact', 'email', 'helpline', 'phone', 'call', 'reach',
]);

// Domain-specific synonym clusters (including Hinglish / Eastern UP local vernacular)
const SYNONYM_CLUSTERS: string[][] = [
  // Lost items & loss verbs (English + Hinglish)
  ['lost', 'lose', 'losing', 'loss', 'misplace', 'misplaced', 'missing', 'dropped', 'forgot', 'forgotten', 'stolen', 'kho', 'khoya', 'khoyi', 'gum', 'chori'],
  // Found items & claims
  ['found', 'claim', 'claiming', 'custody', 'retrieval', 'retrieve', 'deposit', 'deposited', 'recover', 'recovery', 'mila', 'mili', 'paya'],
  // Lost property nouns
  ['wallet', 'purse', 'card', 'id', 'identity', 'keys', 'phone', 'mobile', 'belonging', 'belongings', 'bag', 'backpack', 'laptop', 'charger', 'device', 'property', 'batua', 'saman'],
  // Student Welfare Desk
  ['welfare', 'swd'],
  // Project Teams & Teammates (English + Hinglish)
  ['team', 'teams', 'teammate', 'teammates', 'member', 'members', 'formation', 'partner', 'partners', 'solo', 'alone', 'individual', 'group', 'squad', 'matchmaking', 'discord', 'telegram', 'join', 'joining', 'register', 'registration', 'registering', 'leader', 'size', 'sathi', 'judna', 'judne', 'banaye', 'banayein'],
  // Hackathon events (English + Hinglish)
  ['hackathon', 'hackathons', 'hacktoberfest', 'hack', 'event', 'mlh', 'competition', 'contest', 'challenges', 'swag', 'perk', 'perks', 'domain', 'voucher', 'keynote', 'hacking', 'pratiyogita'],
  // Food & Refreshments (English + Hinglish)
  ['lunch', 'breakfast', 'food', 'cafeteria', 'refreshment', 'refreshments', 'meal', 'meals', 'eat', 'snacks', 'lawn', 'khana', 'bhojan', 'nashta', 'chai'],
  // Wi-Fi & Network
  ['wifi', 'wi-fi', 'internet', 'network', 'ssid', 'connection', 'portal', 'bandwidth', '1gbps', 'password', 'login', 'credentials'],
  // Central Library
  ['library', 'books', 'book', 'reading', 'reference', 'journal', 'journals', 'ieee', 'acm', 'study', 'pustakalaya', 'kitab'],
  // Coding Society & Labs
  ['coding', 'society', 'pcs', 'programming', 'club', 'lab', 'labs', 'workstation', 'workstations', 'linux', 'windows', 'python', 'docker'],
  // Temporal terms (English + Hinglish)
  ['when', 'kab', 'samay', 'tarikh', 'timing', 'schedule'],
  // Location terms (English + Hinglish)
  ['where', 'kahan', 'kidhar', 'jagah', 'venue', 'location'],
  // Action & Procedure terms (English + Hinglish)
  ['how', 'kaise', 'tarika', 'process', 'procedure'],
];

// Bidirectional synonym map
const SYNONYM_MAP: Map<string, string[]> = new Map();
for (const cluster of SYNONYM_CLUSTERS) {
  for (const word of cluster) {
    const others = cluster.filter((w) => w !== word);
    const existing = SYNONYM_MAP.get(word) || [];
    SYNONYM_MAP.set(word, Array.from(new Set([...existing, ...others])));
  }
}

/**
 * Lightweight normalizer / stemmer for English domain terms
 */
export function normalizeToken(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length <= 2) return w;

  // Domain-specific irregular mappings
  if (w === 'lose' || w === 'losing' || w === 'loss') return 'lost';
  if (w === 'teammates' || w === 'teammate') return 'teammate';
  if (w === 'teams' || w === 'team') return 'team';
  if (w === 'members' || w === 'member') return 'member';
  if (w === 'hackathons' || w === 'hackathon') return 'hackathon';
  if (w === 'schedules' || w === 'scheduled') return 'schedule';
  if (w === 'timings' || w === 'timing') return 'timing';
  if (w === 'guidelines' || w === 'guideline') return 'guideline';
  if (w === 'rules' || w === 'rule') return 'rule';
  if (w === 'participants' || w === 'participant') return 'participate';
  if (w === 'participating') return 'participate';
  if (w === 'registration' || w === 'registrations' || w === 'registering') return 'register';
  if (w === 'reporting' || w === 'reported' || w === 'reports') return 'report';
  if (w === 'claiming' || w === 'claimed' || w === 'claims') return 'claim';
  if (w === 'wifi' || w === 'wi-fi') return 'wifi';
  if (w === 'connections' || w === 'connecting') return 'connection';
  if (w === 'passwords') return 'password';
  // Hinglish domain mappings
  if (w === 'khoya' || w === 'khoyi' || w === 'chori') return 'lost';
  if (w === 'banayein' || w === 'banaye' || w === 'judna' || w === 'judne') return 'team';
  if (w === 'kahan' || w === 'kidhar') return 'where';
  if (w === 'kab') return 'when';
  if (w === 'kaise') return 'how';

  // Common suffix reductions (carefully avoiding words ending in us, ss)
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && w.length > 3) return w.slice(0, -1);

  return w;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => normalizeToken(w))
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function expandQueryTokens(tokens: string[]): { words: string[]; weights: Record<string, number> } {
  const wordsSet = new Set<string>();
  const weights: Record<string, number> = {};

  for (const token of tokens) {
    wordsSet.add(token);
    const isGeneric = GENERIC_CAMPUS_TERMS.has(token);
    const isTemporal = TEMPORAL_TERMS.has(token);
    const isLocation = LOCATION_TERMS.has(token);
    const isAction = ACTION_TERMS.has(token);
    const isContact = CONTACT_TERMS.has(token);

    // Entity terms get highest weight (4.0); generic campus words get lowest (0.5)
    weights[token] = isGeneric
      ? 0.5
      : isTemporal || isLocation || isAction || isContact
      ? 1.5
      : 4.0;

    // Synonyms
    const syns = SYNONYM_MAP.get(token);
    if (syns) {
      for (const rawSyn of syns) {
        const syn = normalizeToken(rawSyn);
        wordsSet.add(syn);
        const synWeight = isGeneric ? 0.3 : 1.8;
        weights[syn] = Math.max(weights[syn] || 0, synWeight);
      }
    }
  }

  return { words: Array.from(wordsSet), weights };
}

export function searchCampusKnowledge(
  query: string,
  topK = 3,
  minScoreThreshold = 1.0,
  chunksOverride?: DocumentChunk[]
): RetrievalResult[] {
  const chunks = chunksOverride || getAllChunks();
  if (!chunks || chunks.length === 0) return [];

  const rawTokens = tokenize(query);
  if (rawTokens.length === 0) return [];

  const { words: queryTerms, weights } = expandQueryTokens(rawTokens);
  const totalChunks = chunks.length;

  // Extract core entity terms (excluding pure temporal, location, action, or generic words)
  const entityTerms = rawTokens.filter(
    (t) =>
      !GENERIC_CAMPUS_TERMS.has(t) &&
      !TEMPORAL_TERMS.has(t) &&
      !LOCATION_TERMS.has(t) &&
      !ACTION_TERMS.has(t) &&
      !CONTACT_TERMS.has(t)
  );

  // Document frequency calculation
  const docFreq: Record<string, number> = {};
  const chunkTokenCache: Map<string, string[]> = new Map();

  let totalLength = 0;
  for (const chunk of chunks) {
    const chunkTokens = tokenize(`${chunk.title} ${chunk.category} ${chunk.content}`);
    chunkTokenCache.set(chunk.chunkId, chunkTokens);
    totalLength += chunkTokens.length;

    const uniqueTokens = new Set(chunkTokens);
    for (const term of queryTerms) {
      if (uniqueTokens.has(term)) {
        docFreq[term] = (docFreq[term] || 0) + 1;
      }
    }
  }

  const avgDocLength = totalLength / (totalChunks || 1);
  const k1 = 1.2;
  const b = 0.75;

  const results: { chunk: DocumentChunk; score: number; highlightWords: string[] }[] = [];
  const normalizedQuery = query.toLowerCase().trim();

  for (const chunk of chunks) {
    const chunkTokens = chunkTokenCache.get(chunk.chunkId) || [];
    const docLen = chunkTokens.length;
    const chunkTokensSet = new Set(chunkTokens);

    // Subject Entity Validation:
    // If the student asked about specific entities (e.g. "swimming pool", "lost phone", "wifi"),
    // at least one of those entities or its domain synonyms MUST exist in the chunk!
    // Temporal/location modifiers alone (e.g. "saturday", "where", "schedule") cannot pass this check.
    if (entityTerms.length > 0) {
      let entityMatchFound = false;
      for (const ent of entityTerms) {
        if (chunkTokensSet.has(ent)) {
          entityMatchFound = true;
          break;
        }
        const syns = SYNONYM_MAP.get(ent) || [];
        for (const s of syns) {
          if (chunkTokensSet.has(normalizeToken(s))) {
            entityMatchFound = true;
            break;
          }
        }
        if (entityMatchFound) break;
      }

      if (!entityMatchFound) {
        continue;
      }
    }

    // Term frequencies
    const tf: Record<string, number> = {};
    for (const t of chunkTokens) {
      tf[t] = (tf[t] || 0) + 1;
    }

    let bm25Score = 0;
    const highlightWords: string[] = [];
    let matchedTermsCount = 0;

    for (const term of queryTerms) {
      const freq = tf[term] || 0;
      if (freq > 0) {
        matchedTermsCount++;
        highlightWords.push(term);
        const n = docFreq[term] || 0;
        const idf = Math.log(1 + (totalChunks - n + 0.5) / (n + 0.5));
        const tfComp = (freq * (k1 + 1)) / (freq + k1 * (1 - b + b * (docLen / (avgDocLength || 1))));
        const termWeight = weights[term] || 1.0;
        bm25Score += idf * tfComp * termWeight;
      }
    }

    // Exact phrase match boost
    const chunkLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();

    if (chunkLower.includes(normalizedQuery)) {
      bm25Score += 25.0;
    }

    // Title word boost
    for (const rawToken of rawTokens) {
      if (titleLower.includes(rawToken)) {
        bm25Score += 6.0;
      }
    }

    // Coordination factor: reward chunks that match more query terms
    const coordFactor = (matchedTermsCount / Math.max(queryTerms.length, 1)) + 0.5;
    let finalScore = bm25Score * coordFactor;

    // Direct entity token match boost
    for (const ent of entityTerms) {
      if (chunkTokensSet.has(ent)) {
        finalScore += 5.0;
      }
    }

    // Temporal Intent Alignment:
    // If student asks When / Schedule / Date, prioritize chunks with concrete Date / Timing / Schedule!
    const hasTemporalIntent = rawTokens.some((t) => TEMPORAL_TERMS.has(t));
    if (hasTemporalIntent) {
      if (/date:|timing:|schedule|\b24 october\b/i.test(chunk.content)) {
        finalScore += 20.0;
      }
    }

    // Specific When / Date prioritization: chunks with the calendar date directly answer "When"
    const hasWhenOrDate = rawTokens.some((t) => ['when', 'date', 'dates'].includes(t));
    if (hasWhenOrDate && (/date:|\b24 october\b/i.test(chunk.content) || chunk.order === 1)) {
      finalScore += 16.0;
    }

    // Location Intent Alignment:
    const hasLocationIntent = rawTokens.some((t) => LOCATION_TERMS.has(t));
    if (hasLocationIntent) {
      if (/location:|venue:|physical office|where to report/i.test(chunk.content)) {
        finalScore += 10.0;
      }
    }

    // Category intent alignments:
    // If query contains lost/found terms, heavily boost Lost & Found
    const hasLostIntent = rawTokens.some((t) =>
      ['lost', 'lose', 'misplace', 'missing', 'wallet', 'card', 'found', 'claim', 'swd', 'welfare'].includes(t)
    );
    if (hasLostIntent && chunk.category === 'Lost & Found') {
      finalScore += 12.0;
    }

    // If query contains team terms, heavily boost Project Teams
    const hasTeamIntent = rawTokens.some((t) =>
      ['team', 'partner', 'solo', 'alone', 'member', 'squad', 'formation', 'teammate', 'discord'].includes(t)
    );
    if (hasTeamIntent && chunk.category === 'Project Teams') {
      finalScore += 12.0;
    }

    // If query contains food/lunch terms, boost Hackathons schedule chunk
    const hasFoodIntent = rawTokens.some((t) =>
      ['lunch', 'breakfast', 'food', 'cafeteria', 'refreshment', 'meal', 'eat', 'snack'].includes(t)
    );
    if (hasFoodIntent && chunk.content.toLowerCase().includes('lunch')) {
      finalScore += 12.0;
    }

    // If query contains wifi terms, boost Academics & Campus Wi-Fi chunk
    const hasWifiIntent = rawTokens.some((t) =>
      ['wifi', 'wi-fi', 'internet', 'ssid', 'network', 'portal'].includes(t)
    );
    if (hasWifiIntent && chunk.content.toLowerCase().includes('ssid')) {
      finalScore += 12.0;
    }

    if (finalScore >= minScoreThreshold) {
      results.push({
        chunk,
        score: Math.round(finalScore * 100) / 100,
        highlightWords: Array.from(new Set(highlightWords)),
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}
