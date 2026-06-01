import type { PlayerRoundAnswer } from '../../types/game';
import styles from './WinnerCard.module.css';

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    </svg>
  );
}

interface WinnerCardProps {
  winningAnswerText: string;
  winners: PlayerRoundAnswer[];
}

export default function WinnerCard({ winningAnswerText, winners }: WinnerCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <TrophyIcon />
        <span className={styles.headerLabel}>Winning Answer</span>
      </div>

      <p className={styles.answer}>{winningAnswerText}</p>
      <p className={styles.subtitle}>
        {winners.length} {winners.length === 1 ? 'player' : 'players'} guessed correctly and earned points
      </p>

      <div className={styles.winners}>
        {winners.map((w) => (
          <div key={w.playerId} className={styles.winner}>
            <div className={styles.avatar}>
              <PersonIcon />
            </div>
            <span className={styles.name}>{w.nickname}</span>
            <span className={styles.pts}>+{w.pointsEarned} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
