import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RoundHeader from '../components/question/RoundHeader';
import AnswerOptionCard from '../components/question/AnswerOptionCard';
import Scoreboard from '../components/question/Scoreboard';
import { mockQuestion, mockRoom, mockSelectedPlayerId, mockCurrentScoreboard, WIN_SCORE } from '../mocks/gameMock';
import styles from './QuestionPage.module.css';
const MOCK_ANSWERED_COUNT = 2;
const MOCK_TOTAL_PLAYERS = 3;

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    </svg>
  );
}

export default function QuestionPage() {
  const navigate = useNavigate();
  const question = mockQuestion;
  const selectedPlayer = mockRoom.players.find((p) => p.id === mockSelectedPlayerId) ?? mockRoom.players[1];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimitSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/game/results');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        <RoundHeader
          roundNumber={question.roundNumber}
          totalRounds={question.totalRounds}
          category="Personal habits"
          timeLeft={timeLeft}
          timeLimitSeconds={question.timeLimitSeconds}
        />

        <div className={styles.columns}>

          <div className={styles.main}>

            <Card padded={false}>
              <div className={styles.playerInfo}>
                <span className={styles.aboutBadge}>About this player</span>
                <div className={styles.playerRow}>
                  <div className={styles.playerAvatar}>
                    <PersonIcon />
                  </div>
                  <div>
                    <p className={styles.playerName}>{selectedPlayer.nickname}</p>
                    <p className={styles.playerSubtitle}>Selected player for this round</p>
                  </div>
                </div>
              </div>
            </Card>

            <h2 className={styles.questionText}>{question.text}</h2>

            <div className={styles.options}>
              {question.options.map((option) => (
                <AnswerOptionCard
                  key={option.id}
                  option={option}
                  selected={selectedOptionId === option.id}
                  onSelect={() => setSelectedOptionId(option.id)}
                />
              ))}
            </div>

            <div className={styles.bottomBar}>
              <div className={styles.answeredInfo}>
                <PersonIcon />
                <span>{MOCK_ANSWERED_COUNT} of {MOCK_TOTAL_PLAYERS} players answered</span>
                <span className={styles.answerDots}>
                  {Array.from({ length: MOCK_ANSWERED_COUNT }).map((_, i) => (
                    <span key={i} className={styles.dot} />
                  ))}
                </span>
              </div>
              <Button
                fullWidth={false}
                disabled={!selectedOptionId}
                onClick={() => navigate('/game/results')}
              >
                Submit Answer
              </Button>
            </div>
          </div>

          <div className={styles.sidebar}>

            <Scoreboard entries={mockCurrentScoreboard} winCondition={WIN_SCORE} />

            <Card padded={false}>
              <div className={styles.sideSection}>
                <p className={styles.sideTitle}>Round Status</p>
                <div className={styles.statusList}>
                  <div className={styles.statusItem}>
                    <span className={[styles.statusDot, styles.statusDone].join(' ')} />
                    <span className={styles.statusText}>Question displayed</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={[styles.statusDot, styles.statusActive].join(' ')} />
                    <span className={[styles.statusText, styles.statusTextActive].join(' ')}>
                      Waiting for answers
                    </span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={[styles.statusDot, styles.statusPending].join(' ')} />
                    <span className={[styles.statusText, styles.statusTextMuted].join(' ')}>
                      Reveal results
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card padded={false}>
              <div className={styles.sideSection}>
                <p className={styles.sideTitle}>Game Flow</p>
                <p className={styles.flowText}>
                  Each round, one player is selected. All players vote on the answer they
                  think is correct. Most popular answer wins points for voters.
                </p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
