import styles from './RoundHeader.module.css';

interface RoundHeaderProps {
  roundNumber: number;
  totalRounds: number;
  category: string;
  timeLeft: number;
  timeLimitSeconds: number;
}

export default function RoundHeader({
  roundNumber,
  totalRounds,
  category,
  timeLeft,
  timeLimitSeconds,
}: RoundHeaderProps) {
  const roundProgress = ((roundNumber - 1) / totalRounds) * 100;
  const timeProgress = (timeLeft / timeLimitSeconds) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <span className={styles.roundLabel}>Round {roundNumber} of {totalRounds}</span>
        <div className={styles.roundTrack}>
          <div className={styles.roundFill} style={{ width: `${roundProgress}%` }} />
        </div>
      </div>

      <div className={styles.timeTrack}>
        <div
          className={[styles.timeFill, isLow ? styles.timeFillLow : ''].filter(Boolean).join(' ')}
          style={{ width: `${timeProgress}%` }}
        />
      </div>

      <div className={styles.right}>
        <span className={styles.categoryLabel}>Category: {category}</span>
        <span className={[styles.timeLeft, isLow ? styles.timeLeftLow : ''].filter(Boolean).join(' ')}>
          {timeLeft} seconds remaining
        </span>
      </div>
    </div>
  );
}
