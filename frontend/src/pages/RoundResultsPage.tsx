import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { mockRoundResult } from '../mocks/gameMock';
import styles from './RoundResultsPage.module.css';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function RoundResultsPage() {
  const navigate = useNavigate();
  const result = mockRoundResult;
  const { question } = result;

  const correctOption = question.options.find((o) => o.id === result.correctOptionId);
  const correctLabel = OPTION_LABELS[question.options.findIndex((o) => o.id === result.correctOptionId)];

  function getAnswerLabel(selectedOptionId: string | null): string {
    if (!selectedOptionId) return 'Brak odpowiedzi';
    const index = question.options.findIndex((o) => o.id === selectedOptionId);
    const option = question.options[index];
    return `${OPTION_LABELS[index]}. ${option.text}`;
  }

  return (
    <PageLayout wide>
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.roundLabel}>Runda {result.roundNumber} / {result.totalRounds} — wyniki</p>
          <h2 className={styles.questionText}>{question.text}</h2>
          <p className={styles.correctLabel}>
            Poprawna odpowiedź:{' '}
            <span className={styles.correctAnswer}>
              {correctLabel}. {correctOption?.text}
            </span>
          </p>
        </div>

        <Card>
          <ul className={styles.playerList}>
            {result.playerAnswers.map((pa) => (
              <li key={pa.playerId} className={styles.playerRow}>
                <div className={styles.playerInfo}>
                  <span className={styles.nickname}>{pa.nickname}</span>
                  <span className={[styles.answer, pa.isCorrect ? styles.answerCorrect : styles.answerWrong].join(' ')}>
                    {getAnswerLabel(pa.selectedOptionId)}
                  </span>
                </div>
                <span className={styles.points}>
                  {pa.isCorrect ? `+${pa.pointsEarned}` : '0'}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className={styles.standingsLabel}>Aktualna klasyfikacja</div>
        <Card>
          <ul className={styles.standingsList}>
            {result.scoreboard.map((s) => (
              <li key={s.playerId} className={styles.standingRow}>
                <span className={styles.rank}>#{s.rank}</span>
                <span className={styles.standingNickname}>{s.nickname}</span>
                <span className={styles.totalScore}>{s.totalScore} pkt</span>
              </li>
            ))}
          </ul>
        </Card>

        <Button onClick={() => navigate('/game/podium')}>Następna runda</Button>
      </div>
    </PageLayout>
  );
}
