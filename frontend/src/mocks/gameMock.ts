import type { Room, Question, RoundResult, GameSummary, ScoreEntry } from '../types/game';

export const mockRoom: Room = {
  code: 'PARTY7',
  inviteLink: 'http://localhost:5173/join/PARTY7',
  settings: {
    maxPlayers: 8,
    totalRounds: 12,
    timeLimitSeconds: 36,
  },
  players: [
    { id: 'p1', nickname: 'Marek', isHost: true },
    { id: 'p2', nickname: 'Ania', isHost: false },
    { id: 'p3', nickname: 'Tomek', isHost: false },
    { id: 'p4', nickname: 'Kasia', isHost: false },
  ],
};

export const mockCurrentPlayerId = 'p1';

// The player this round's question is about
export const mockSelectedPlayerId = 'p2';

export const mockQuestion: Question = {
  id: 'q2',
  roundNumber: 2,
  totalRounds: 12,
  text: "What is Ania's morning beverage habit?",
  options: [
    { id: 'a', text: 'Coffee every morning' },
    { id: 'b', text: 'Tea occasionally' },
    { id: 'c', text: 'Energy drinks daily' },
    { id: 'd', text: 'Water only' },
  ],
  correctOptionId: 'a',
  timeLimitSeconds: 36,
};

// Live scoreboard during the question phase (before this round's results)
export const mockCurrentScoreboard: ScoreEntry[] = [
  { playerId: 'p1', nickname: 'Marek', totalScore: 30, rank: 1 },
  { playerId: 'p2', nickname: 'Ania', totalScore: 25, rank: 2 },
  { playerId: 'p3', nickname: 'Tomek', totalScore: 20, rank: 3 },
  { playerId: 'p4', nickname: 'Kasia', totalScore: 10, rank: 4 },
];

export const mockRoundResult: RoundResult = {
  roundNumber: 2,
  totalRounds: 12,
  question: mockQuestion,
  correctOptionId: 'a',
  playerAnswers: [
    { playerId: 'p1', nickname: 'Marek', selectedOptionId: 'a', isCorrect: true, pointsEarned: 920 },
    { playerId: 'p2', nickname: 'Ania', selectedOptionId: 'a', isCorrect: true, pointsEarned: 750 },
    { playerId: 'p3', nickname: 'Tomek', selectedOptionId: 'c', isCorrect: false, pointsEarned: 0 },
    { playerId: 'p4', nickname: 'Kasia', selectedOptionId: null, isCorrect: false, pointsEarned: 0 },
  ],
  scoreboard: [
    { playerId: 'p1', nickname: 'Marek', totalScore: 950, rank: 1 },
    { playerId: 'p2', nickname: 'Ania', totalScore: 775, rank: 2 },
    { playerId: 'p3', nickname: 'Tomek', totalScore: 20, rank: 3 },
    { playerId: 'p4', nickname: 'Kasia', totalScore: 10, rank: 4 },
  ],
};

export const mockGameSummary: GameSummary = {
  totalRounds: 12,
  finalRanking: [
    { playerId: 'p1', nickname: 'Marek', totalScore: 4350, rank: 1 },
    { playerId: 'p2', nickname: 'Ania', totalScore: 3900, rank: 2 },
    { playerId: 'p3', nickname: 'Tomek', totalScore: 2100, rank: 3 },
    { playerId: 'p4', nickname: 'Kasia', totalScore: 1450, rank: 4 },
  ],
};
