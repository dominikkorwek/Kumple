import type { AnswerResponse } from '../../types/api';
import styles from './FreeTextAnswer.module.css';

interface FreeTextAnswerProps {
  phase: 'writing' | 'voting';
  freeText: string;
  onFreeTextChange: (val: string) => void;
  answers: AnswerResponse[];
  selectedAnswerId: number | null;
  onSelectAnswer: (id: number) => void;
  submitted: boolean;
  currentPlayerId: string;
  loading?: boolean;
}

export default function FreeTextAnswer({
  phase,
  freeText,
  onFreeTextChange,
  answers,
  selectedAnswerId,
  onSelectAnswer,
  submitted,
  currentPlayerId,
  loading,
}: FreeTextAnswerProps) {
  if (phase === 'writing') {
    return (
      <div className={styles.container}>
        {submitted ? (
          <div className={styles.waiting}>
            <span className={styles.check}>✓</span>
            <p className={styles.waitLabel}>Answer submitted! Waiting for others…</p>
          </div>
        ) : (
          <>
            <textarea
              className={styles.textarea}
              placeholder="Write your answer…"
              value={freeText}
              onChange={(e) => onFreeTextChange(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <p className={styles.charCount}>{freeText.length} / 500</p>
          </>
        )}
      </div>
    );
  }

  const otherAnswers = answers.filter((a) => a.author?.id !== currentPlayerId);

  return (
    <div className={styles.container}>
      <p className={styles.votePrompt}>Vote for the best answer:</p>
      <div className={styles.voteList}>
        {otherAnswers.map((ans) => (
          <button
            key={ans.id}
            className={[styles.voteCard, selectedAnswerId === ans.id ? styles.voteCardSelected : ''].filter(Boolean).join(' ')}
            onClick={() => onSelectAnswer(ans.id)}
            disabled={submitted || loading}
          >
            <span className={styles.voteText}>{ans.content}</span>
            {selectedAnswerId === ans.id && <span className={styles.voteCheck}>✓</span>}
          </button>
        ))}
        {otherAnswers.length === 0 && (
          <p className={styles.noAnswers}>No answers to vote on yet.</p>
        )}
      </div>
    </div>
  );
}
