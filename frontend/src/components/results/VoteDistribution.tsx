import type { VoteCount } from '../../types/game';
import styles from './VoteDistribution.module.css';

interface VoteDistributionProps {
  votes: VoteCount[];
}

export default function VoteDistribution({ votes }: VoteDistributionProps) {
  const maxVotes = Math.max(...votes.map((v) => v.votes), 1);

  return (
    <div className={styles.widget}>
      <p className={styles.title}>Vote Distribution</p>
      <div className={styles.rows}>
        {votes.map((v) => (
          <div key={v.optionId} className={styles.row}>
            <div className={styles.labelRow}>
              <span className={styles.label}>{v.optionText}</span>
              <span className={styles.count}>
                {v.votes} {v.votes === 1 ? 'vote' : 'votes'}
              </span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${(v.votes / maxVotes) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
