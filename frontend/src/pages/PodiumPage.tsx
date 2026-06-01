import { useNavigate } from 'react-router-dom';
import { mockGameSummary, WIN_SCORE } from '../mocks/gameMock';
import PodiumPlayer from '../components/podium/PodiumPlayer';
import FinalRankingList from '../components/podium/FinalRankingList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import layout from '../styles/lobbyLayout.module.css';
import styles from './PodiumPage.module.css';

function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm2 2h10v2H7v-2z" />
    </svg>
  );
}

// Classic podium order: 2nd on left, 1st in center, 3rd on right
const PODIUM_ORDER: Array<1 | 2 | 3> = [2, 1, 3];

export default function PodiumPage() {
  const navigate = useNavigate();
  const { finalRanking } = mockGameSummary;
  const top3 = finalRanking.slice(0, 3);
  const winner = finalRanking[0];

  return (
    <div className={layout.page}>
      <div className={layout.columns}>

        {/* ── Left: podium ── */}
        <div className={layout.left}>
          <div className={styles.pageHeader}>
            <span className={styles.badge}>
              <TrophyIcon />
              Victory Podium
            </span>
            <h1 className={styles.title}>Game Complete!</h1>
            <p className={styles.subtitle}>Congratulations to all players</p>
          </div>

          <div className={styles.podiumWrap}>
            <div className={styles.podium}>
              {PODIUM_ORDER.map((place) => {
                const player = top3[place - 1];
                if (!player) return null;
                return <PodiumPlayer key={player.playerId} player={player} place={place} />;
              })}
            </div>
            <p className={styles.placeholder}>
              Placeholder: Celebration animation / particle effects
            </p>
          </div>

          <Button onClick={() => navigate('/game/summary')}>View Final Summary</Button>
        </div>

        {/* ── Right: sidebar ── */}
        <div className={layout.right}>
          <Card padded={false}>
            <div className={styles.panel}>
              <FinalRankingList entries={finalRanking} winnerId={winner.playerId} />
            </div>
          </Card>

          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Winner Highlight</p>
              <div className={styles.winnerHighlight}>
                <span className={styles.winnerIcon}>
                  <CrownIcon />
                </span>
                <div className={styles.winnerInfo}>
                  <p className={styles.winnerName}>{winner.nickname}</p>
                  <p className={styles.winnerSub}>Reached {WIN_SCORE} points</p>
                </div>
              </div>
              <p className={styles.winnerDesc}>
                First player to exceed the {WIN_SCORE} point win condition. Congratulations!
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
