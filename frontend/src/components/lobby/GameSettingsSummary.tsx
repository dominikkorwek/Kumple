import type { GameSettings } from '../../types/game';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './GameSettingsSummary.module.css';

export const GAME_CATEGORIES = ['Personal', 'Preferences', 'Memories', 'Options', 'Future', 'Fun'];

interface GameSettingsSummaryProps {
  settings: GameSettings;
  selectedCategories: string[];
  onToggleCategory: (cat: string) => void;
  onStartGame: () => void;
  onCancel: () => void;
}

export default function GameSettingsSummary({
  settings,
  selectedCategories,
  onToggleCategory,
  onStartGame,
  onCancel,
}: GameSettingsSummaryProps) {
  return (
    <>
      <Card padded={false}>
        <div className={styles.section}>
          <p className={styles.title}>Game Settings</p>

          <div className={styles.categoriesBlock}>
            <p className={styles.label}>Question Categories</p>
            <div className={styles.chips}>
              {GAME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={[
                    styles.chip,
                    selectedCategories.includes(cat) ? styles.chipActive : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => onToggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settingRows}>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Win condition</span>
              <span className={styles.settingValue}>100 points</span>
            </div>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Answer time</span>
              <span className={styles.settingValue}>{settings.timeLimitSeconds} seconds</span>
            </div>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Room capacity</span>
              <span className={styles.settingValue}>{settings.maxPlayers} players</span>
            </div>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <div className={styles.section}>
          <p className={styles.title}>Real Time Sync</p>
          <div className={styles.syncRow}>
            <span className={styles.liveDot} />
            <span className={styles.syncLabel}>Lobby updates live</span>
          </div>
          <p className={styles.syncDesc}>
            Players can join or leave anytime. Host controls when game starts.
          </p>
        </div>
      </Card>

      <Card padded={false}>
        <div className={styles.section}>
          <p className={styles.title}>Host Controls</p>
          <ul className={styles.controlsList}>
            <li>Start game when ready</li>
            <li>Kick players if needed</li>
            <li>Cancel and close room</li>
          </ul>
          <div className={styles.actions}>
            <Button onClick={onStartGame}>Start Game</Button>
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </Card>
    </>
  );
}
