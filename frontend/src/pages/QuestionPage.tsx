import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { mockQuestion } from '../mocks/gameMock';
import styles from './QuestionPage.module.css';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionPage() {
  const navigate = useNavigate();
  const question = mockQuestion;

  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);

  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft <= 0) {
      navigate('/game/results');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, selected, navigate]);

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => navigate('/game/results'), 1000);
  }

  const progress = (timeLeft / question.timeLimit) * 100;

  return (
    <PageLayout wide>
      <div className={styles.page}>
        <div className={styles.timerBar}>
          <div className={styles.timerFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.meta}>
          <span className={styles.round}>Runda 1</span>
          <span className={styles.timer}>{timeLeft}s</span>
        </div>

        <h2 className={styles.question}>{question.text}</h2>

        <div className={styles.options}>
          {question.options.map((option, index) => (
            <button
              key={index}
              className={[
                styles.option,
                selected === index ? styles.selected : '',
                selected !== null && index === question.correctIndex ? styles.correct : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleSelect(index)}
              disabled={selected !== null}
            >
              <span className={styles.optionLabel}>{OPTION_LABELS[index]}</span>
              <span className={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
