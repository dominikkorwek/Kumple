import styles from './RoundHeader.module.css';

interface RoundHeaderProps {
  roundNumber: number;
  category?: string;
  roundType: string;
  timeLeft: number;
  timePerAnswer: number;
}

const ROUND_TYPE_LABELS: Record<string, string> = {
  GUESS_PLAYER_ANSWER: 'Guess the Answer',
  REUSE_QUESTION: 'Classic Question',
  VOTE_PERSON: 'Vote for a Person',
  PLAYER_CREATES_QUESTION: 'Custom Question',
  BEST_ANSWER: 'Best Answer',
};

export default function RoundHeader({ roundNumber, category, roundType, timeLeft, timePerAnswer }: RoundHeaderProps) {
  const timeProgress = timePerAnswer > 0 ? (timeLeft / timePerAnswer) * 100 : 0;
  const isLow = timeLeft <= 10;
  const label = ROUND_TYPE_LABELS[roundType] ?? roundType;

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <span className={styles.roundLabel}>Round {roundNumber}</span>
        <span className={styles.typeLabel}>{label}</span>
      </div>

      <div className={styles.timeTrack}>
        <div
          className={[styles.timeFill, isLow ? styles.timeFillLow : ''].filter(Boolean).join(' ')}
          style={{ width: `${timeProgress}%` }}
        />
      </div>

      <div className={styles.right}>
        {category && <span className={styles.categoryLabel}>Category: {category}</span>}
        <span className={[styles.timeLeft, isLow ? styles.timeLeftLow : ''].filter(Boolean).join(' ')}>
          {timeLeft} seconds remaining
        </span>
      </div>
    </div>
  );
}
