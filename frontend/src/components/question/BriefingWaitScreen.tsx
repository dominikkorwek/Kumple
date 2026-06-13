import styles from './BriefingWaitScreen.module.css';

interface BriefingWaitScreenProps {
  readyCount: number;
  totalPlayers: number;
  selfReady: boolean;
}

export default function BriefingWaitScreen({ readyCount, totalPlayers, selfReady }: BriefingWaitScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.title}>
        {selfReady ? 'Czekamy na pozostałych graczy…' : 'Potwierdź gotowość, aby rozpocząć rundę'}
      </p>
      <p className={styles.count}>
        Gotowych: <strong>{readyCount}</strong> / {totalPlayers}
      </p>
      {selfReady && (
        <p className={styles.hint}>Runda wystartuje, gdy wszyscy potwierdzą instrukcje.</p>
      )}
    </div>
  );
}
