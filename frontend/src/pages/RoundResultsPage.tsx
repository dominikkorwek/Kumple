import { useNavigate } from 'react-router-dom';
import { mockRoundResult, WIN_SCORE } from '../mocks/gameMock';
import WinnerCard from '../components/results/WinnerCard';
import VoteDistribution from '../components/results/VoteDistribution';
import UpdatedRankings from '../components/results/UpdatedRankings';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import layout from '../styles/lobbyLayout.module.css';
import styles from './RoundResultsPage.module.css';

export default function RoundResultsPage() {
  const navigate = useNavigate();
  const result = mockRoundResult;

  const winners = result.playerAnswers.filter((pa) => pa.isCorrect);
  const leader = result.scoreboard[0];
  const leadPct = Math.min((leader.totalScore / WIN_SCORE) * 100, 100);

  return (
    <div className={layout.page}>
      <div className={layout.columns}>

        <div className={layout.left}>
          <div className={styles.pageHeader}>
            <span className={styles.roundBadge}>
              Round {result.roundNumber} Complete
            </span>
            <h1 className={styles.title}>Round Results</h1>
          </div>

          <WinnerCard winningAnswerText={result.winningAnswerText} winners={winners} />

          <div className={styles.whySection}>
            <p className={styles.whyTitle}>Why this answer won</p>
            <div className={styles.whyBox}>
              <p className={styles.whyText}>
                Most players voted for &ldquo;{result.winningAnswerText}&rdquo; as the correct
                answer. In this game, the most popular answer wins, regardless of truth.
              </p>
            </div>
          </div>

          <Button onClick={() => navigate('/game/podium')}>Continue to Next Round</Button>
        </div>

        <div className={layout.right}>
          <Card padded={false}>
            <div className={styles.panel}>
              <UpdatedRankings entries={result.scoreboard} />
            </div>
          </Card>

          <Card padded={false}>
            <div className={styles.panel}>
              <VoteDistribution votes={result.voteDistribution} />
            </div>
          </Card>

          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Progress to Win</p>
              <div className={styles.progressRow}>
                <span className={styles.progressLeader}>{leader.nickname} (leading)</span>
                <span className={styles.progressValue}>{leader.totalScore}/{WIN_SCORE}</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${leadPct}%` }} />
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
