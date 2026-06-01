import { useNavigate } from 'react-router-dom';
import { mockGameSummary, WIN_SCORE } from '../mocks/gameMock';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import layout from '../styles/lobbyLayout.module.css';
import styles from './GameSummaryPage.module.css';

/* ── Icons ─────────────────────────────────────────────────────────────── */

function TrophyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 11H11V7h1.5v5.25l4.5 2.67-.75 1.23-3.75-2.15z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function GameSummaryPage() {
  const navigate = useNavigate();
  const { finalRanking, totalRounds, gameDurationMinutes } = mockGameSummary;
  const winner = finalRanking[0];

  return (
    <div className={layout.page}>
      <div className={layout.columns}>

        {/* ── Left: main content ── */}
        <div className={layout.left}>

          {/* Header */}
          <div className={styles.pageHeader}>
            <span className={styles.badge}>
              <TrophyIcon size={13} />
              Game Over
            </span>
            <h1 className={styles.title}>Game Complete!</h1>
            <p className={styles.subtitle}>Thanks for playing PartyWire Game</p>
          </div>

          {/* Winner card */}
          <div className={styles.winnerCard}>
            <span className={styles.winnerTrophy}>
              <TrophyIcon size={40} />
            </span>
            <p className={styles.winnerName}>{winner.nickname} Wins!</p>
            <p className={styles.winnerPts}>{winner.totalScore} points</p>
          </div>

          {/* Final Rankings */}
          <Card padded={false}>
            <div className={styles.rankingsPanel}>
              <p className={styles.rankingsTitle}>Final Rankings</p>
              <div className={styles.rankingsList}>
                {finalRanking.map((e) => (
                  <div
                    key={e.playerId}
                    className={`${styles.rankRow} ${e.rank === 1 ? styles.rankRowWinner : ''}`}
                  >
                    <span className={`${styles.rankCircle} ${e.rank === 1 ? styles.rankCircleWinner : ''}`}>
                      {e.rank}
                    </span>
                    <span className={styles.rankAvatar}>
                      <PersonIcon />
                    </span>
                    <div className={styles.rankInfo}>
                      <span className={`${styles.rankName} ${e.rank === 1 ? styles.rankNameWinner : ''}`}>
                        {e.nickname}
                      </span>
                      <span className={styles.rankSub}>{e.roundsWon ?? 0} rounds won</span>
                    </div>
                    <span className={styles.rankScore}>{e.totalScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Action buttons */}
          <div className={styles.actions}>
            <Button onClick={() => navigate('/lobby')}>
              <span className={styles.btnInner}><PlayIcon /> Play Again</span>
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              <span className={styles.btnInner}><HomeIcon /> Return to Main</span>
            </Button>
          </div>

        </div>

        {/* ── Right: sidebar ── */}
        <div className={layout.right}>

          {/* Game Statistics */}
          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Game Statistics</p>
              <div className={styles.stats}>
                <div className={styles.statBox}>
                  <span className={styles.statIcon}><ClockIcon /></span>
                  <div>
                    <p className={styles.statLabel}>Total Rounds</p>
                    <p className={styles.statValue}>{totalRounds}</p>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statIcon}><ClockIcon /></span>
                  <div>
                    <p className={styles.statLabel}>Game Duration</p>
                    <p className={styles.statValue}>{gameDurationMinutes ?? 0} minutes</p>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statIcon}><PersonIcon /></span>
                  <div>
                    <p className={styles.statLabel}>Players</p>
                    <p className={styles.statValue}>{finalRanking.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Score Breakdown</p>
              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Highest scorer:</span>
                  <span className={styles.breakdownVal}>{winner.nickname}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Winning score:</span>
                  <span className={`${styles.breakdownVal} ${styles.breakdownAccent}`}>
                    {WIN_SCORE}
                  </span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Round count:</span>
                  <span className={styles.breakdownVal}>{totalRounds}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Actions */}
          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Next Actions</p>
              <ul className={styles.nextActions}>
                <li>Start new game with same players</li>
                <li>Change settings and play again</li>
                <li>Return to main menu</li>
              </ul>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
