import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { mockGameSummary } from '../mocks/gameMock';
import styles from './PodiumPage.module.css';

const PLACE_ORDER = [1, 0, 2];
const PLACE_LABELS = ['🥇', '🥈', '🥉'];

export default function PodiumPage() {
  const navigate = useNavigate();
  const top3 = mockGameSummary.finalRanking.slice(0, 3);

  return (
    <PageLayout>
      <div className={styles.page}>
        <h2 className={styles.title}>Podium</h2>

        <div className={styles.podium}>
          {PLACE_ORDER.map((orderIndex) => {
            const player = top3[orderIndex];
            if (!player) return null;
            return (
              <div key={player.playerId} className={[styles.podiumSlot, styles[`place${orderIndex + 1}`]].join(' ')}>
                <span className={styles.medal}>{PLACE_LABELS[orderIndex]}</span>
                <span className={styles.podiumNickname}>{player.nickname}</span>
                <span className={styles.podiumScore}>{player.totalScore} pkt</span>
              </div>
            );
          })}
        </div>

        <Button onClick={() => navigate('/game/summary')}>Zobacz pełne wyniki</Button>
      </div>
    </PageLayout>
  );
}
