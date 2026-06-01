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
  rankChange?: number; // positive = moved up, negative = moved down
  roundsWon?: number;
}

export interface VoteCount {
  optionId: string;
  optionText: string;
  votes: number;
}

export interface RoundResult {
  roundNumber: number;
  totalRounds: number;
  question: Question;
  correctOptionId: string;
  winningAnswerText: string;
  playerAnswers: PlayerRoundAnswer[];
  scoreboard: ScoreEntry[];
  voteDistribution: VoteCount[];
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
  gameDurationMinutes?: number;
  finalRanking: ScoreEntry[];
}
