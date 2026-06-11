import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import styles from './QuestionCreateForm.module.css';

interface QuestionCreateFormProps {
  onSubmit: (questionContent: string, answers: string[], correctIndex: number) => void;
  loading?: boolean;
  /** When set, the question already exists — show it read-only and skip the question input */
  existingQuestion?: string;
}

export default function QuestionCreateForm({ onSubmit, loading, existingQuestion }: QuestionCreateFormProps) {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const hasExisting = Boolean(existingQuestion);

  function updateAnswer(i: number, val: string) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  function handleSubmit() {
    if (!hasExisting && !questionText.trim()) { setError('Question text is required'); return; }
    const filled = answers.filter((a) => a.trim());
    if (filled.length < 2) { setError('At least 2 answer options are required'); return; }
    if (correctIndex === null) { setError('Mark one answer as correct'); return; }
    if (!answers[correctIndex]?.trim()) { setError('Correct answer cannot be empty'); return; }
    setError('');
    onSubmit(hasExisting ? '' : questionText.trim(), answers, correctIndex);
  }

  const canSubmit = (hasExisting || questionText.trim()) && answers.filter((a) => a.trim()).length >= 2 && correctIndex !== null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {hasExisting ? (
          <>
            <span className={styles.badge}>Your turn to answer</span>
            <h2 className={styles.title}>Provide Your Answers</h2>
            <p className={styles.hint}>Add answer options and mark YOUR real answer as correct. Others will try to guess it!</p>
          </>
        ) : (
          <>
            <span className={styles.badge}>Your turn to create</span>
            <h2 className={styles.title}>Create a Question</h2>
            <p className={styles.hint}>Write a question and provide answer options. Mark the correct one.</p>
          </>
        )}
      </div>

      {hasExisting ? (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Question</p>
          <p className={styles.existingQuestion}>{existingQuestion}</p>
        </div>
      ) : (
      <div className={styles.section}>
        <Input
          label="Question"
          placeholder="e.g. What did I do last weekend?"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          maxLength={200}
        />
      </div>
      )}

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Answer Options</p>
        <div className={styles.answerGrid}>
          {answers.map((ans, i) => (
            <div key={i} className={styles.answerRow}>
              <button
                className={[styles.correctBtn, correctIndex === i ? styles.correctBtnActive : ''].filter(Boolean).join(' ')}
                onClick={() => setCorrectIndex(i)}
                type="button"
                aria-label={`Mark answer ${i + 1} as correct`}
              >
                {correctIndex === i ? '✓' : String.fromCharCode(65 + i)}
              </button>
              <input
                className={styles.answerInput}
                placeholder={`Answer ${String.fromCharCode(65 + i)}`}
                value={ans}
                onChange={(e) => updateAnswer(i, e.target.value)}
                maxLength={200}
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
        {loading ? 'Submitting…' : 'Submit Question'}
      </Button>
    </div>
  );
}
