import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RoundHeader from '../components/question/RoundHeader';
import AnswerOptionCard from '../components/question/AnswerOptionCard';
import Scoreboard from '../components/question/Scoreboard';
import WaitingForQuestion from '../components/question/WaitingForQuestion';
import QuestionCreateForm from '../components/question/QuestionCreateForm';
import VotePersonGrid from '../components/question/VotePersonGrid';
import FreeTextAnswer from '../components/question/FreeTextAnswer';
import { submitAnswer, submitQuestion, getGameState } from '../services/api';
import { connectRoom, disconnect } from '../services/stomp';
import { usePlayer } from '../context/PlayerContext';
import type { GameStateResponse, RoundResponse, AnswerResponse } from '../types/api';
import type { ScoreEntry } from '../types/game';
import styles from './QuestionPage.module.css';

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    </svg>
  );
}

function toScoreEntries(gs: GameStateResponse): ScoreEntry[] {
  return gs.ranking.map((s, idx) => ({
    playerId: s.player.id,
    nickname: s.player.nickname,
    totalScore: s.points,
    rank: idx + 1,
  }));
}

export default function QuestionPage() {
  const navigate = useNavigate();
  const { session } = usePlayer();

  const roomCode = session?.roomCode ?? '';
  const playerId = session?.playerId ?? '';

  const [gameState, setGameState] = useState<GameStateResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const [selectedVoteAnswerId, setSelectedVoteAnswerId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMessage = useCallback(
    (msg: GameStateResponse | { event?: string }) => {
      if (!('status' in msg)) return;
      const gs = msg as GameStateResponse;
      setGameState(gs);

      if (gs.status === 'FINISHED') { navigate('/game/podium'); return; }

      const round = gs.currentRound;
      if (!round) return;

      if (round.status === 'REVEALING' || round.status === 'COMPLETED') {
        navigate('/game/results');
        return;
      }

      if (round.status === 'WAITING_FOR_ANSWERS') {
        setTimeLeft(gs.timePerAnswer);
        setTimerActive(true);
        setSubmitted(false);
        setSelectedOptionId(null);
        setSelectedPersonId(null);
        setFreeText('');
        setSelectedVoteAnswerId(null);
      }

      if (round.status === 'WAITING_FOR_QUESTION') {
        setTimerActive(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!roomCode) { navigate('/'); return; }

    let cancelled = false;
    getGameState(roomCode)
      .then((gs) => { if (!cancelled) handleMessage(gs); })
      .catch(() => { if (!cancelled) navigate('/'); });
    connectRoom(roomCode, playerId, (msg) => handleMessage(msg as GameStateResponse), undefined);

    return () => {
      cancelled = true;
      disconnect();
    };
  }, [roomCode, playerId, handleMessage, navigate]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive]);

  async function handleSubmitAnswer(answerId: number | null, ft: string | null, selectedAnswId: number | null) {
    const round = gameState?.currentRound;
    if (!round) return;
    setLoading(true);
    try {
      await submitAnswer(round.id, { playerId, answerId, freeText: ft, selectedAnswerId: selectedAnswId });
      setSubmitted(true);
      setTimerActive(false);
    } catch {
      // ignore, user can retry
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateQuestion(questionContent: string, answers: string[], correctIndex: number) {
    const round = gameState?.currentRound;
    if (!round) return;
    setLoading(true);
    try {
      const answerOptions = answers
        .filter((a) => a.trim())
        .map((a, i) => ({ content: a, correct: i === correctIndex, targetPlayerId: null }));
      await submitQuestion(round.id, { questionContent, answers: answerOptions, answersArePlayers: false });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const round: RoundResponse | null = gameState?.currentRound ?? null;
  const scoreboard: ScoreEntry[] = gameState ? toScoreEntries(gameState) : [];
  const winCondition = gameState?.pointLimit ?? 100;
  const isSelectedPlayer = round?.selectedPlayer?.id === playerId;
  const answeredCount = round?.answers.filter((a) => a.author !== null).length ?? 0;
  const totalPlayers = gameState?.room.currentPlayers ?? 0;

  function renderQuestionContent() {
    if (!round) return <div className={styles.loadingText}>Loading round…</div>;

    if (round.status === 'WAITING_FOR_QUESTION') {
      if (isSelectedPlayer) {
        const existingQ =
          (round.roundType === 'GUESS_PLAYER_ANSWER' || round.roundType === 'REUSE_QUESTION')
            ? (round.question?.content ?? undefined)
            : undefined;
        return <QuestionCreateForm onSubmit={handleCreateQuestion} loading={loading} existingQuestion={existingQ} />;
      }
      return <WaitingForQuestion selectedPlayerNickname={round.selectedPlayer?.nickname ?? 'Player'} />;
    }

    if (round.status === 'WAITING_FOR_ANSWERS' || round.status === 'COMPLETED') {
      const rt = round.roundType;

      if (rt === 'VOTE_PERSON') {
        return (
          <>
            <h2 className={styles.questionText}>{round.question?.content ?? ''}</h2>
            <VotePersonGrid
              players={gameState?.room.players ?? []}
              selectedId={selectedPersonId}
              onSelect={(id) => {
                const ans = round.answers.find((a) => a.targetPlayer?.id === id);
                if (ans) { setSelectedPersonId(id); setSelectedOptionId(ans.id); }
              }}
              disabled={submitted || loading}
              currentPlayerId={playerId}
            />
            {renderSubmitBar(<Button fullWidth={false} disabled={!selectedPersonId || submitted || loading} onClick={() => handleSubmitAnswer(selectedOptionId, null, null)}>
              {submitted ? 'Submitted' : 'Vote'}
            </Button>)}
          </>
        );
      }

      if (rt === 'BEST_ANSWER') {
        const myAnswer = round.answers.find((a: AnswerResponse) => a.author?.id === playerId);
        const phase: 'writing' | 'voting' = myAnswer ? 'voting' : 'writing';
        return (
          <>
            <h2 className={styles.questionText}>{round.question?.content ?? ''}</h2>
            <FreeTextAnswer
              phase={phase}
              freeText={freeText}
              onFreeTextChange={setFreeText}
              answers={round.answers}
              selectedAnswerId={selectedVoteAnswerId}
              onSelectAnswer={(id) => setSelectedVoteAnswerId(id)}
              submitted={submitted}
              currentPlayerId={playerId}
              loading={loading}
            />
            {renderSubmitBar(
              phase === 'writing' ? (
                <Button fullWidth={false} disabled={!freeText.trim() || submitted || loading} onClick={() => handleSubmitAnswer(null, freeText, null)}>
                  {submitted ? 'Submitted' : loading ? 'Submitting…' : 'Submit Answer'}
                </Button>
              ) : (
                <Button fullWidth={false} disabled={!selectedVoteAnswerId || submitted || loading} onClick={() => handleSubmitAnswer(null, null, selectedVoteAnswerId)}>
                  {submitted ? 'Voted' : loading ? 'Voting…' : 'Vote for Best'}
                </Button>
              )
            )}
          </>
        );
      }

      return (
        <>
          {round.selectedPlayer && (
            <Card padded={false}>
              <div className={styles.playerInfo}>
                <span className={styles.aboutBadge}>About this player</span>
                <div className={styles.playerRow}>
                  <div className={styles.playerAvatar}><PersonIcon /></div>
                  <div>
                    <p className={styles.playerName}>{round.selectedPlayer.nickname}</p>
                    <p className={styles.playerSubtitle}>Selected player for this round</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <h2 className={styles.questionText}>{round.question?.content ?? ''}</h2>

          <div className={styles.options}>
            {round.answers.map((opt) => (
              <AnswerOptionCard
                key={opt.id}
                option={{ id: opt.id, content: opt.content, correct: opt.correct, voteCount: opt.voteCount, author: null, targetPlayer: null }}
                selected={selectedOptionId === opt.id}
                onSelect={() => !submitted && setSelectedOptionId(opt.id)}
                disabled={submitted || loading}
              />
            ))}
          </div>

          {renderSubmitBar(
            <Button fullWidth={false} disabled={!selectedOptionId || submitted || loading} onClick={() => handleSubmitAnswer(selectedOptionId, null, null)}>
              {submitted ? 'Submitted' : loading ? 'Submitting…' : 'Submit Answer'}
            </Button>
          )}
        </>
      );
    }

    return null;
  }

  function renderSubmitBar(actionButton: React.ReactNode) {
    return (
      <div className={styles.bottomBar}>
        <div className={styles.answeredInfo}>
          <PersonIcon />
          <span>{answeredCount} of {totalPlayers} players answered</span>
        </div>
        {actionButton}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        <RoundHeader
          roundNumber={round?.roundNumber ?? 1}
          category={round?.question?.category ?? undefined}
          roundType={round?.roundType ?? 'GUESS_PLAYER_ANSWER'}
          timeLeft={timeLeft}
          timePerAnswer={gameState?.timePerAnswer ?? 30}
        />

        <div className={styles.columns}>

          <div className={styles.main}>
            {renderQuestionContent()}
          </div>

          <div className={styles.sidebar}>
            <Scoreboard entries={scoreboard} winCondition={winCondition} />

            <Card padded={false}>
              <div className={styles.sideSection}>
                <p className={styles.sideTitle}>Round Status</p>
                <div className={styles.statusList}>
                  <div className={styles.statusItem}>
                    <span className={[styles.statusDot, round?.status !== 'WAITING_FOR_QUESTION' ? styles.statusDone : styles.statusActive].join(' ')} />
                    <span className={styles.statusText}>Question ready</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={[styles.statusDot, round?.status === 'WAITING_FOR_ANSWERS' ? styles.statusActive : round?.status === 'REVEALING' || round?.status === 'COMPLETED' ? styles.statusDone : styles.statusPending].join(' ')} />
                    <span className={[styles.statusText, round?.status === 'WAITING_FOR_ANSWERS' ? styles.statusTextActive : styles.statusTextMuted].join(' ')}>
                      Waiting for answers
                    </span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={[styles.statusDot, round?.status === 'REVEALING' ? styles.statusActive : styles.statusPending].join(' ')} />
                    <span className={[styles.statusText, styles.statusTextMuted].join(' ')}>
                      Reveal results
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
