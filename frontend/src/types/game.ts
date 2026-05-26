export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
  score: number;
}

export interface Room {
  code: string;
  maxPlayers: number;
  players: Player[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

export interface PlayerRoundAnswer {
  playerId: string;
  nickname: string;
  answerIndex: number | null;
  isCorrect: boolean;
  points: number;
}

export interface PlayerStanding {
  playerId: string;
  nickname: string;
  totalScore: number;
  rank: number;
}

export interface RoundResult {
  roundNumber: number;
  questionText: string;
  correctIndex: number;
  options: string[];
  playerAnswers: PlayerRoundAnswer[];
  standings: PlayerStanding[];
}

export interface GameSummary {
  totalRounds: number;
  standings: PlayerStanding[];
}
