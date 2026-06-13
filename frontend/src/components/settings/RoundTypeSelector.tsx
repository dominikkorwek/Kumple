import type { RoundType } from '../../types/api';
import { ALL_ROUND_TYPES, ROUND_TYPE_LABELS, toggleRoundTypeExclusion, includedRoundTypeCount } from '../../constants/roundTypes';
import styles from './CategorySelector.module.css';

interface RoundTypeSelectorProps {
  excludedTypes: RoundType[];
  onChange?: (excludedTypes: RoundType[]) => void;
  disabled?: boolean;
  variant?: 'chips' | 'grid';
  hint?: string;
}

export default function RoundTypeSelector({
  excludedTypes,
  onChange,
  disabled = false,
  variant = 'chips',
  hint = 'Aktywne typy rund biorą udział w grze. Kliknij, aby włączyć lub wyłączyć.',
}: RoundTypeSelectorProps) {
  function handleToggle(roundType: RoundType) {
    if (disabled || !onChange) return;
    const next = toggleRoundTypeExclusion(excludedTypes, roundType);
    if (includedRoundTypeCount(next) <= 0) return;
    onChange(next);
  }

  if (variant === 'grid') {
    return (
      <div className={styles.block}>
        <p className={styles.label}>Typy rund</p>
        {hint && <p className={styles.hint}>{hint}</p>}
        <div className={styles.grid}>
          {ALL_ROUND_TYPES.map((roundType) => {
            const included = !excludedTypes.includes(roundType);
            return (
              <label key={roundType} className={styles.gridRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={included}
                  disabled={disabled}
                  onChange={() => handleToggle(roundType)}
                />
                <span>{ROUND_TYPE_LABELS[roundType]}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.block}>
      <p className={styles.label}>Typy rund</p>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.chips}>
        {ALL_ROUND_TYPES.map((roundType) => {
          const included = !excludedTypes.includes(roundType);
          return (
            <button
              key={roundType}
              type="button"
              className={[styles.chip, included ? styles.chipActive : ''].filter(Boolean).join(' ')}
              onClick={() => handleToggle(roundType)}
              disabled={disabled}
            >
              {ROUND_TYPE_LABELS[roundType]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { includedRoundTypeCount };
