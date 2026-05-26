import type { Room, Question, RoundResult, GameSummary } from '../types/game';

export const mockRoom: Room = {
  code: 'PARTY7',
  inviteLink: 'http://localhost:5173/join/PARTY7',
  settings: {
    maxPlayers: 8,
    totalRounds: 5,
    timeLimitSeconds: 20,
  },
  players: [
    { id: 'p1', nickname: 'Marek', isHost: true },
    { id: 'p2', nickname: 'Ania', isHost: false },
    { id: 'p3', nickname: 'Tomek', isHost: false },
    { id: 'p4', nickname: 'Kasia', isHost: false },
  ],
};

export const mockCurrentPlayerId = 'p1';

export const mockQuestion: Question = {
  id: 'q3',
  roundNumber: 3,
  totalRounds: 5,
  text: 'Które miasto jest stolicą Australii?',
  options: [
    { id: 'a', text: 'Sydney' },
    { id: 'b', text: 'Melbourne' },
    { id: 'c', text: 'Canberra' },
    { id: 'd', text: 'Brisbane' },
  ],
  correctOptionId: 'c',
  timeLimitSeconds: 20,
};

export const mockRoundResult: RoundResult = {
  roundNumber: 3,
  totalRounds: 5,
  question: mockQuestion,
  correctOptionId: 'c',
  playerAnswers: [
    { playerId: 'p1', nickname: 'Marek', selectedOptionId: 'c', isCorrect: true, pointsEarned: 920 },
    { playerId: 'p2', nickname: 'Ania', selectedOptionId: 'c', isCorrect: true, pointsEarned: 750 },
    { playerId: 'p3', nickname: 'Tomek', selectedOptionId: 'a', isCorrect: false, pointsEarned: 0 },
    { playerId: 'p4', nickname: 'Kasia', selectedOptionId: null, isCorrect: false, pointsEarned: 0 },
  ],
  scoreboard: [
    { playerId: 'p1', nickname: 'Marek', totalScore: 2640, rank: 1 },
    { playerId: 'p2', nickname: 'Ania', totalScore: 2410, rank: 2 },
    { playerId: 'p3', nickname: 'Tomek', totalScore: 1100, rank: 3 },
    { playerId: 'p4', nickname: 'Kasia', totalScore: 850, rank: 4 },
  ],
};

export const mockGameSummary: GameSummary = {
  totalRounds: 5,
  finalRanking: [
    { playerId: 'p1', nickname: 'Marek', totalScore: 4350, rank: 1 },
    { playerId: 'p2', nickname: 'Ania', totalScore: 3900, rank: 2 },
    { playerId: 'p3', nickname: 'Tomek', totalScore: 2100, rank: 3 },
    { playerId: 'p4', nickname: 'Kasia', totalScore: 1450, rank: 4 },
  ],
};
