import type { Room, Question, RoundResult, GameSummary } from '../types/game';

export const mockRoom: Room = {
  code: 'XKCD42',
  maxPlayers: 10,
  players: [
    { id: '1', nickname: 'Marek', isHost: true, score: 0 },
    { id: '2', nickname: 'Ania', isHost: false, score: 0 },
    { id: '3', nickname: 'Tomek', isHost: false, score: 0 },
    { id: '4', nickname: 'Kasia', isHost: false, score: 0 },
  ],
};

export const mockQuestion: Question = {
  id: 'q1',
  text: 'Które miasto jest stolicą Australii?',
  options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
  correctIndex: 2,
  timeLimit: 20,
};

export const mockRoundResult: RoundResult = {
  roundNumber: 1,
  questionText: 'Które miasto jest stolicą Australii?',
  correctIndex: 2,
  options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
  playerAnswers: [
    { playerId: '1', nickname: 'Marek', answerIndex: 2, isCorrect: true, points: 920 },
    { playerId: '2', nickname: 'Ania', answerIndex: 2, isCorrect: true, points: 750 },
    { playerId: '3', nickname: 'Tomek', answerIndex: 0, isCorrect: false, points: 0 },
    { playerId: '4', nickname: 'Kasia', answerIndex: 1, isCorrect: false, points: 0 },
  ],
  standings: [
    { playerId: '1', nickname: 'Marek', totalScore: 920, rank: 1 },
    { playerId: '2', nickname: 'Ania', totalScore: 750, rank: 2 },
    { playerId: '3', nickname: 'Tomek', totalScore: 0, rank: 3 },
    { playerId: '4', nickname: 'Kasia', totalScore: 0, rank: 4 },
  ],
};

export const mockGameSummary: GameSummary = {
  totalRounds: 5,
  standings: [
    { playerId: '1', nickname: 'Marek', totalScore: 4350, rank: 1 },
    { playerId: '2', nickname: 'Ania', totalScore: 3900, rank: 2 },
    { playerId: '3', nickname: 'Tomek', totalScore: 2100, rank: 3 },
    { playerId: '4', nickname: 'Kasia', totalScore: 1450, rank: 4 },
  ],
};
