import type { RoundType } from '../../types/api';
import { ROUND_TYPE_TUTORIALS } from '../../constants/roundTypeTutorials';
import Button from '../ui/Button';
import styles from './RoundTypeTutorial.module.css';

interface RoundTypeTutorialProps {
  roundType: RoundType;
  onConfirm: () => void;
  loading?: boolean;
}

export default function RoundTypeTutorial({ roundType, onConfirm, loading }: RoundTypeTutorialProps) {
  const content = ROUND_TYPE_TUTORIALS[roundType];

  return (
    <div className={styles.container}>
      <span className={styles.badge}>Nowy typ rundy</span>
      <h2 className={styles.title}>{content.title}</h2>
      <p className={styles.intro}>Pierwszy raz gracie w ten sposób — oto krótka instrukcja:</p>

      <ol className={styles.steps}>
        {content.steps.map((step, i) => (
          <li key={i} className={styles.step}>{step}</li>
        ))}
      </ol>

      {content.tip && <p className={styles.tip}>{content.tip}</p>}

      <p className={styles.notice}>
        Potwierdź, że rozumiesz zasady — dopiero wtedy runda ruszy dalej. Inni gracze też muszą to zrobić.
      </p>

      <Button onClick={onConfirm} disabled={loading}>
        {loading ? 'Potwierdzanie…' : 'Rozumiem — jestem gotowy'}
      </Button>
    </div>
  );
}
