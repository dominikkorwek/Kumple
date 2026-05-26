import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { mockQuestion } from '../mocks/gameMock';
import styles from './QuestionPage.module.css';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionPage() {
  const navigate = useNavigate();
  const question = mockQuestion;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimitSeconds);

  useEffect(() => {
    if (selectedId !== null) return;
    if (timeLeft <= 0) {
      navigate('/game/results');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, selectedId, navigate]);

  function handleSelect(optionId: string) {
    if (selectedId !== null) return;
    setSelectedId(optionId);
    setTimeout(() => navigate('/game/results'), 1000);
  }

  const progress = (timeLeft / question.timeLimitSeconds) * 100;

  return (
    <PageLayout wide>
      <div className={styles.page}>
        <div className={styles.timerBar}>
          <div className={styles.timerFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.meta}>
          <span className={styles.round}>Runda {question.roundNumber} / {question.totalRounds}</span>
          <span className={styles.timer}>{timeLeft}s</span>
        </div>

        <h2 className={styles.question}>{question.text}</h2>

        <div className={styles.options}>
          {question.options.map((option, index) => (
            <button
              key={option.id}
              className={[
                styles.option,
                selectedId === option.id ? styles.selected : '',
                selectedId !== null && option.id === question.correctOptionId ? styles.correct : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleSelect(option.id)}
              disabled={selectedId !== null}
            >
              <span className={styles.optionLabel}>{OPTION_LABELS[index]}</span>
              <span className={styles.optionText}>{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
