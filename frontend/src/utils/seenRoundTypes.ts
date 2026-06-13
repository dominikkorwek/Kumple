import type { RoundType } from '../types/api';

const STORAGE_PREFIX = 'kumple_seen_round_types_';

function storageKey(gameSessionId: number, playerId: string) {
  return `${STORAGE_PREFIX}${gameSessionId}_${playerId}`;
}

export function getSeenRoundTypes(gameSessionId: number, playerId: string): RoundType[] {
  if (!playerId || !gameSessionId) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(gameSessionId, playerId));
    if (!raw) return [];
    return JSON.parse(raw) as RoundType[];
  } catch {
    return [];
  }
}

export function hasSeenRoundType(gameSessionId: number, playerId: string, roundType: RoundType): boolean {
  return getSeenRoundTypes(gameSessionId, playerId).includes(roundType);
}

export function markRoundTypeSeen(gameSessionId: number, playerId: string, roundType: RoundType): void {
  if (!playerId || !gameSessionId) return;
  const seen = getSeenRoundTypes(gameSessionId, playerId);
  if (seen.includes(roundType)) return;
  sessionStorage.setItem(storageKey(gameSessionId, playerId), JSON.stringify([...seen, roundType]));
}
