export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
}

export interface GameSettings {
  maxPlayers: number;
  totalRounds: number;
  timeLimitSeconds: number;
}

export interface Room {
  code: string;
  inviteLink: string;
  settings: GameSettings;
  players: Player[];
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  roundNumber: number;
  totalRounds: number;
  text: string;
  options: AnswerOption[];
  correctOptionId: string;
  timeLimitSeconds: number;
}

export interface ScoreEntry {
  playerId: string;
  nickname: string;
  totalScore: number;
  rank: number;
}

export interface RoundResult {
  roundNumber: number;
  totalRounds: number;
  question: Question;
  correctOptionId: string;
  playerAnswers: PlayerRoundAnswer[];
  scoreboard: ScoreEntry[];
}

export interface PlayerRoundAnswer {
  playerId: string;
  nickname: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface GameSummary {
  totalRounds: number;
  finalRanking: ScoreEntry[];
}
