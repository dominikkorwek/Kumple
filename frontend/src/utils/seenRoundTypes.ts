import type { RoundResponse, RoundType } from '../types/api';

const STORAGE_PREFIX = 'kumple_seen_round_types_';
type SeenBriefingKey = string;

function storageKey(gameSessionId: number, playerId: string) {
  return `${STORAGE_PREFIX}${gameSessionId}_${playerId}`;
}

export function getSeenRoundTypes(gameSessionId: number, playerId: string): SeenBriefingKey[] {
  if (!playerId || !gameSessionId) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(gameSessionId, playerId));
    if (!raw) return [];
    return JSON.parse(raw) as SeenBriefingKey[];
  } catch {
    return [];
  }
}

export function hasSeenRoundType(gameSessionId: number, playerId: string, roundType: RoundType): boolean {
  return getSeenRoundTypes(gameSessionId, playerId).includes(`roundType:${roundType}`);
}

export function markRoundTypeSeen(gameSessionId: number, playerId: string, roundType: RoundType): void {
  if (!playerId || !gameSessionId) return;
  const seen = getSeenRoundTypes(gameSessionId, playerId);
  const key = `roundType:${roundType}`;
  if (seen.includes(key)) return;
  sessionStorage.setItem(storageKey(gameSessionId, playerId), JSON.stringify([...seen, key]));
}

function briefingKey(round: Pick<RoundResponse, 'roundType' | 'question'>): string {
  const category = round.question?.category?.trim();
  if (category) {
    return `category:${category.toLowerCase()}`;
  }
  return `roundType:${round.roundType}`;
}

export function hasSeenBriefing(gameSessionId: number, playerId: string, round: Pick<RoundResponse, 'roundType' | 'question'>): boolean {
  return getSeenRoundTypes(gameSessionId, playerId).includes(briefingKey(round));
}

export function markBriefingSeen(gameSessionId: number, playerId: string, round: Pick<RoundResponse, 'roundType' | 'question'>): void {
  if (!playerId || !gameSessionId) return;
  const seen = getSeenRoundTypes(gameSessionId, playerId);
  const key = briefingKey(round);
  if (seen.includes(key)) return;
  sessionStorage.setItem(storageKey(gameSessionId, playerId), JSON.stringify([...seen, key]));
}
