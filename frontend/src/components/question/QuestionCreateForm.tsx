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
    if (!hasExisting && !questionText.trim()) { setError('Treść pytania jest wymagana'); return; }
    const filled = answers.filter((a) => a.trim());
    if (filled.length < 2) { setError('Wymagane są co najmniej 2 opcje odpowiedzi'); return; }
    if (correctIndex === null) { setError('Oznacz jedną odpowiedź jako poprawną'); return; }
    if (!answers[correctIndex]?.trim()) { setError('Poprawna odpowiedź nie może być pusta'); return; }
    setError('');
    onSubmit(hasExisting ? '' : questionText.trim(), answers, correctIndex);
  }

  const canSubmit = (hasExisting || questionText.trim()) && answers.filter((a) => a.trim()).length >= 2 && correctIndex !== null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {hasExisting ? (
          <>
            <span className={styles.badge}>Twoja kolej na odpowiedź</span>
            <h2 className={styles.title}>Podaj swoje odpowiedzi</h2>
            <p className={styles.hint}>Dodaj opcje odpowiedzi i oznacz SWOJĄ prawdziwą odpowiedź jako poprawną. Inni będą próbowali ją zgadnąć!</p>
          </>
        ) : (
          <>
            <span className={styles.badge}>Twoja kolej na tworzenie</span>
            <h2 className={styles.title}>Utwórz pytanie</h2>
            <p className={styles.hint}>Napisz pytanie i podaj opcje odpowiedzi. Oznacz poprawną.</p>
          </>
        )}
      </div>

      {hasExisting ? (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Pytanie</p>
          <p className={styles.existingQuestion}>{existingQuestion}</p>
        </div>
      ) : (
      <div className={styles.section}>
        <Input
          label="Pytanie"
          placeholder="np. Co robiłem w ostatni weekend?"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          maxLength={200}
        />
      </div>
      )}

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Opcje odpowiedzi</p>
        <div className={styles.answerGrid}>
          {answers.map((ans, i) => (
            <div key={i} className={styles.answerRow}>
              <button
                className={[styles.correctBtn, correctIndex === i ? styles.correctBtnActive : ''].filter(Boolean).join(' ')}
                onClick={() => setCorrectIndex(i)}
                type="button"
                aria-label={`Oznacz odpowiedź ${i + 1} jako poprawną`}
              >
                {correctIndex === i ? '✓' : String.fromCharCode(65 + i)}
              </button>
              <input
                className={styles.answerInput}
                placeholder={`Odpowiedź ${String.fromCharCode(65 + i)}`}
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
        {loading ? 'Wysyłanie…' : 'Wyślij pytanie'}
      </Button>
    </div>
  );
}
