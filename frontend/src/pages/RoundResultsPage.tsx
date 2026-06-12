import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WinnerCard from '../components/results/WinnerCard';
import VoteDistribution from '../components/results/VoteDistribution';
import UpdatedRankings from '../components/results/UpdatedRankings';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { nextRound, getGameState } from '../services/api';
import { connectRoom, disconnect } from '../services/stomp';
import { usePlayer } from '../context/PlayerContext';
import type { GameStateResponse } from '../types/api';
import type { ScoreEntry, VoteCount } from '../types/game';
import layout from '../styles/lobbyLayout.module.css';
import styles from './RoundResultsPage.module.css';

function toScoreEntries(gs: GameStateResponse): ScoreEntry[] {
  return gs.ranking.map((s, idx) => ({
    playerId: s.player.id,
    nickname: s.player.nickname,
    totalScore: s.points,
    rank: idx + 1,
  }));
}

export default function RoundResultsPage() {
  const navigate = useNavigate();
  const { session } = usePlayer();

  const roomCode = session?.roomCode ?? '';
  const playerId = session?.playerId ?? '';
  const isHost = session?.isHost ?? false;

  const [gameState, setGameState] = useState<GameStateResponse | null>(null);
  const [nextLoading, setNextLoading] = useState(false);

  const handleMessage = useCallback(
    (msg: GameStateResponse | { event?: string }) => {
      if (!('status' in msg)) return;
      const gs = msg as GameStateResponse;
      setGameState(gs);
      if (gs.status === 'FINISHED') { navigate('/game/podium'); return; }
      if (gs.currentRound?.status === 'WAITING_FOR_ANSWERS' || gs.currentRound?.status === 'WAITING_FOR_QUESTION') {
        navigate('/game/question');
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!roomCode) { navigate('/'); return; }
    let cancelled = false;
    getGameState(roomCode)
      .then((gs) => { if (!cancelled) setGameState(gs); })
      .catch(() => { if (!cancelled) navigate('/'); });
    connectRoom(roomCode, playerId, (msg) => handleMessage(msg as GameStateResponse), undefined);
    return () => {
      cancelled = true;
      disconnect();
    };
  }, [roomCode, playerId, handleMessage, navigate]);

  async function handleNextRound() {
    setNextLoading(true);
    try {
      await nextRound(roomCode);
    } finally {
      setNextLoading(false);
    }
  }

  const round = gameState?.currentRound;
  const winningAnswer = round?.winningAnswer;
  const scoreboard: ScoreEntry[] = gameState ? toScoreEntries(gameState) : [];
  const winCondition = gameState?.pointLimit ?? 100;

  const voteDistribution: VoteCount[] = (round?.answers ?? []).map((a) => ({
    optionId: a.id,
    optionText: a.content,
    votes: a.voteCount,
  }));

  const leader = scoreboard[0];
  const leadPct = leader ? Math.min((leader.totalScore / winCondition) * 100, 100) : 0;

  return (
    <div className={layout.page}>
      <div className={layout.columns}>

        <div className={layout.left}>
          <div className={styles.pageHeader}>
            <span className={styles.roundBadge}>
              Runda {round?.roundNumber ?? '—'} zakończona
            </span>
            <h1 className={styles.title}>Wyniki rundy</h1>
          </div>

          {winningAnswer ? (
            <WinnerCard winningAnswerText={winningAnswer.content} voteCount={winningAnswer.voteCount} />
          ) : round?.roundType === 'VOTE_PERSON' && round.status === 'COMPLETED' ? (
            <WinnerCard winningAnswerText="Remis — brak punktów" voteCount={0} />
          ) : (
            <WinnerCard winningAnswerText="Oczekiwanie na wynik…" />
          )}

          <div className={styles.whySection}>
            <p className={styles.whyTitle}>Dlaczego ta odpowiedź wygrała</p>
            <div className={styles.whyBox}>
              <p className={styles.whyText}>
                {winningAnswer
                  ? `Większość graczy zagłosowała na „${winningAnswer.content}" jako poprawną odpowiedź.`
                  : round?.roundType === 'VOTE_PERSON' && round.status === 'COMPLETED'
                    ? 'Remis po ponownym głosowaniu — nikt nie otrzymał punktów w tej rundzie.'
                    : 'Wyniki są obliczane…'}
              </p>
            </div>
          </div>

          {isHost && (
            <Button onClick={handleNextRound} disabled={nextLoading}>
              {nextLoading ? 'Ładowanie…' : 'Przejdź do następnej rundy'}
            </Button>
          )}
          {!isHost && (
            <p className={styles.waitingText}>Oczekiwanie, aż host rozpocznie następną rundę…</p>
          )}
        </div>

        <div className={layout.right}>
          <Card padded={false}>
            <div className={styles.panel}>
              <UpdatedRankings entries={scoreboard} />
            </div>
          </Card>

          {voteDistribution.length > 0 && (
            <Card padded={false}>
              <div className={styles.panel}>
                <VoteDistribution votes={voteDistribution} />
              </div>
            </Card>
          )}

          {leader && (
            <Card padded={false}>
              <div className={styles.panel}>
                <p className={styles.panelLabel}>Postęp do wygranej</p>
                <div className={styles.progressRow}>
                  <span className={styles.progressLeader}>{leader.nickname} (lider)</span>
                  <span className={styles.progressValue}>{leader.totalScore}/{winCondition}</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${leadPct}%` }} />
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
