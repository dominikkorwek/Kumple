import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { mockGameSummary } from '../mocks/gameMock';
import styles from './GameSummaryPage.module.css';

export default function GameSummaryPage() {
  const navigate = useNavigate();
  const { standings, totalRounds } = mockGameSummary;

  return (
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Koniec gry!</h2>
          <p className={styles.subtitle}>{totalRounds} rundy • wyniki końcowe</p>
        </div>

        <Card>
          <ul className={styles.list}>
            {standings.map((player) => (
              <li key={player.playerId} className={[styles.row, player.rank === 1 ? styles.winner : ''].join(' ')}>
                <span className={styles.rank}>#{player.rank}</span>
                <span className={styles.nickname}>{player.nickname}</span>
                <span className={styles.score}>{player.totalScore} pkt</span>
              </li>
            ))}
          </ul>
        </Card>

        <Button onClick={() => navigate('/')}>Zagraj ponownie</Button>
      </div>
    </PageLayout>
  );
}
