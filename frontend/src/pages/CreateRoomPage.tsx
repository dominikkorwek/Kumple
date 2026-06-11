import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getCategories } from '../services/api';
import type { QuestionCategoryResponse } from '../types/api';
import layout from '../styles/lobbyLayout.module.css';
import styles from './CreateRoomPage.module.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const POINT_STEP = 10;

export interface PendingRoomSettings {
  maxPlayers: number;
  pointLimit: number;
  timePerAnswer: number;
  excludedCategoryIds: number[];
}

export const PENDING_SETTINGS_KEY = 'pendingRoomSettings';

export default function CreateRoomPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<QuestionCategoryResponse[]>([]);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [pointLimit, setPointLimit] = useState(100);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [timePerAnswer, setTimePerAnswer] = useState(30);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  function toggleExcluded(id: number) {
    setExcludedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handlePointLimitChange(raw: number) {
    const snapped = Math.round(raw / POINT_STEP) * POINT_STEP;
    setPointLimit(Math.max(10, Math.min(1000, snapped)));
  }

  function handleContinue() {
    const settings: PendingRoomSettings = {
      maxPlayers: Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, maxPlayers)),
      pointLimit: Math.max(10, Math.min(1000, Math.round(pointLimit / POINT_STEP) * POINT_STEP)),
      timePerAnswer: Math.max(5, Math.min(120, timePerAnswer)),
      excludedCategoryIds: excludedIds,
    };
    sessionStorage.setItem(PENDING_SETTINGS_KEY, JSON.stringify(settings));
    navigate('/join?host=true');
  }

  return (
    <div className={layout.page}>
      <div className={layout.columns}>

        <div className={layout.left}>

          <button className={styles.backLink} onClick={() => navigate('/')}>
            ← Back to main
          </button>

          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Create Game Room</h1>
            <p className={styles.subtitle}>Configure your game settings, then set up your profile</p>
          </div>

          {categories.length > 0 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Excluded Categories (Optional)</h2>
              <div className={styles.checkboxGrid}>
                {categories.map((cat) => (
                  <label key={cat.id} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={excludedIds.includes(cat.id)}
                      onChange={() => toggleExcluded(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Game Settings</h2>
            <div className={styles.inputs}>
              <Input
                label="Points to win (multiples of 10)"
                type="number"
                value={pointLimit}
                onChange={(e) => handlePointLimitChange(Number(e.target.value))}
                min={10}
                max={1000}
                step={POINT_STEP}
              />
              <Input
                label={`Maximum players (${MIN_PLAYERS}–${MAX_PLAYERS})`}
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                min={MIN_PLAYERS}
                max={MAX_PLAYERS}
              />
              <Input
                label="Answer time limit (seconds)"
                type="number"
                value={timePerAnswer}
                onChange={(e) => setTimePerAnswer(Number(e.target.value))}
                min={5}
                max={120}
              />
            </div>
          </div>

        </div>

        <div className={layout.right}>

          <Card padded={false}>
            <div className={styles.panelSection}>
              <p className={styles.panelTitle}>Settings Summary</p>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Excluded</span>
                  <span className={styles.summaryValue}>{excludedIds.length} categories</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Points to win</span>
                  <span className={styles.summaryValue}>{pointLimit}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Max players</span>
                  <span className={styles.summaryValue}>{maxPlayers}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Time limit</span>
                  <span className={styles.summaryValue}>{timePerAnswer}s</span>
                </div>
              </div>

              <Button onClick={handleContinue} fullWidth>
                Continue & Pick Avatar →
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
