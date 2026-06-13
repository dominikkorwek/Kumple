import type { RoundType } from '../types/api';

const STORAGE_PREFIX = 'kumple_seen_round_types_';

function storageKey(playerId: string) {
  return `${STORAGE_PREFIX}${playerId}`;
}

export function getSeenRoundTypes(playerId: string): RoundType[] {
  if (!playerId) return [];
  try {
    const raw = localStorage.getItem(storageKey(playerId));
    if (!raw) return [];
    return JSON.parse(raw) as RoundType[];
  } catch {
    return [];
  }
}

export function hasSeenRoundType(playerId: string, roundType: RoundType): boolean {
  return getSeenRoundTypes(playerId).includes(roundType);
}

export function markRoundTypeSeen(playerId: string, roundType: RoundType): void {
  if (!playerId) return;
  const seen = getSeenRoundTypes(playerId);
  if (seen.includes(roundType)) return;
  localStorage.setItem(storageKey(playerId), JSON.stringify([...seen, roundType]));
}
