export interface SessionProgressRecord {
  id: string;
  createdAt: string;
  gameTitle: string;
  focusTitle: string;
  conversationCard: string;
  usefulPhrase: string;
  whatHappened: string;
  nextTime: string;
}

const STORAGE_KEY = 'meeple-sosen-session-progress';

export function loadSessionProgress(): SessionProgressRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function saveSessionProgressRecord(record: Omit<SessionProgressRecord, 'id' | 'createdAt'>) {
  const records = loadSessionProgress();
  const nextRecord: SessionProgressRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([nextRecord, ...records].slice(0, 20)));
  return nextRecord;
}
