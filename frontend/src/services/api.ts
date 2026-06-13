import type {
  RoomResponse,
  GameStateResponse,
  QuestionCategoryResponse,
  JoinRoomResponse,
  GameSettingsRequest,
  SubmitAnswerRequest,
  SubmitQuestionRequest,
  ClassicSetupResponse,
} from '../types/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) msg = body.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function createRoom(hostNickname: string, maxPlayers: number, avatarAnimal: string, avatarColor: string): Promise<JoinRoomResponse> {
  const room = await request<RoomResponse>('/api/rooms', {
    method: 'POST',
    body: JSON.stringify({ hostNickname, maxPlayers, avatarAnimal, avatarColor }),
  });
  const player = room.players.find((p) => p.isHost) ?? room.players[0];
  return { player, room };
}

export function getRoomByCode(code: string): Promise<RoomResponse> {
  return request(`/api/rooms/${code}`);
}

export function joinRoom(code: string, nickname: string, avatarAnimal: string, avatarColor: string): Promise<JoinRoomResponse> {
  return request(`/api/rooms/${code}/join`, {
    method: 'POST',
    body: JSON.stringify({ nickname, avatarAnimal, avatarColor }),
  });
}

export function leaveRoom(code: string, playerId: string): Promise<void> {
  return request(`/api/rooms/${code}/leave`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  });
}

export function getCategories(): Promise<QuestionCategoryResponse[]> {
  return request('/api/categories');
}

export function updateSettings(code: string, settings: GameSettingsRequest): Promise<GameStateResponse> {
  return request(`/api/rooms/${code}/settings`, {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}

export function startGame(code: string): Promise<GameStateResponse> {
  return request(`/api/rooms/${code}/start`, { method: 'POST' });
}

export function nextRound(code: string): Promise<GameStateResponse> {
  return request(`/api/rooms/${code}/rounds/next`, { method: 'POST' });
}

export function submitAnswer(roundId: number, payload: SubmitAnswerRequest): Promise<GameStateResponse> {
  return request(`/api/rounds/${roundId}/submit-answer`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getClassicSetup(roundId: number, playerId: string): Promise<ClassicSetupResponse> {
  return request(`/api/rounds/${roundId}/classic-setup?playerId=${encodeURIComponent(playerId)}`);
}

export function submitQuestion(roundId: number, payload: SubmitQuestionRequest): Promise<GameStateResponse> {
  return request(`/api/rounds/${roundId}/submit-question`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function ackBriefing(roundId: number, playerId: string): Promise<GameStateResponse> {
  return request(`/api/rounds/${roundId}/ack-briefing`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  });
}

export function expireRoundTime(roundId: number): Promise<GameStateResponse> {
  return request(`/api/rounds/${roundId}/expire-time`, { method: 'POST' });
}

export function getGameState(code: string): Promise<GameStateResponse> {
  return request(`/api/rooms/${code}/game`);
}
