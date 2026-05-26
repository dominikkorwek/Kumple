import type { AnswerOption } from '../../types/game';
import styles from './AnswerOptionCard.module.css';

interface AnswerOptionCardProps {
  option: AnswerOption;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function AnswerOptionCard({ option, selected, onSelect, disabled }: AnswerOptionCardProps) {
  return (
    <button
      className={[styles.card, selected ? styles.selected : ''].filter(Boolean).join(' ')}
      onClick={onSelect}
      disabled={disabled}
    >
      <span className={styles.text}>{option.text}</span>
      <span className={[styles.radio, selected ? styles.radioSelected : ''].filter(Boolean).join(' ')} />
    </button>
  );
}
