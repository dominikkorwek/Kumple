import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { mockRoom } from '../mocks/gameMock';
import layout from '../styles/lobbyLayout.module.css';
import styles from './CreateRoomPage.module.css';

const QUESTION_CATEGORIES = [
  'Personal habits', 'Preferences',
  'Memories', 'Opinions',
  'Future plans', 'Fun facts',
];

const EXCLUDED_CATEGORIES = [
  'Controversial topics', 'Relationship questions',
];

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const room = mockRoom;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(QUESTION_CATEGORIES);
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [pointLimit, setPointLimit] = useState(100);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(30);

  function toggleSelected(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleExcluded(cat: string) {
    setExcludedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className={layout.page}>
      <div className={layout.columns}>

        {/* ── Left: form ────────────────────────────── */}
        <div className={layout.left}>

          <button className={styles.backLink} onClick={() => navigate('/')}>
            ← Back to main
          </button>

          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Create Game Room</h1>
            <p className={styles.subtitle}>Configure game settings and generate invite code</p>
          </div>

          {/* Question Categories */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Question Categories</h2>
            <div className={styles.checkboxGrid}>
              {QUESTION_CATEGORIES.map((cat) => (
                <label key={cat} className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleSelected(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Excluded Categories */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Excluded Categories (Optional)</h2>
            <div className={styles.checkboxGrid}>
              {EXCLUDED_CATEGORIES.map((cat) => (
                <label key={cat} className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={excludedCategories.includes(cat)}
                    onChange={() => toggleExcluded(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Game Settings */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Game Settings</h2>
            <div className={styles.inputs}>
              <Input
                label="Point limit to win"
                type="number"
                value={pointLimit}
                onChange={(e) => setPointLimit(Number(e.target.value))}
                min={10}
                max={1000}
              />
              <Input
                label="Maximum players"
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                min={2}
                max={20}
              />
              <Input
                label="Answer time limit (seconds)"
                type="number"
                value={timeLimitSeconds}
                onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
                min={5}
                max={120}
              />
            </div>
          </div>

        </div>

        {/* ── Right: generated room + summary ───────── */}
        <div className={layout.right}>

          <Card padded={false}>
            <div className={styles.panelSection}>
              <p className={styles.panelTitle}>Generated Room</p>

              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Room Code</p>
                <div className={styles.codeBox}>
                  <span className={styles.codeText}>{room.code}</span>
                  <button className={styles.iconBtn} onClick={() => copy(room.code)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Invite Link</p>
                <div className={styles.linkBox}>
                  <input className={styles.linkInput} value={room.inviteLink} readOnly />
                  <button className={styles.iconBtn} onClick={() => copy(room.inviteLink)}>
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <Button onClick={() => navigate('/lobby')}>Create &amp; Enter Lobby</Button>
            </div>
          </Card>

          <Card padded={false}>
            <div className={styles.panelSection}>
              <p className={styles.panelTitle}>Settings Summary</p>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Categories</span>
                  <span className={styles.summaryValue}>{selectedCategories.length} selected</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Point limit</span>
                  <span className={styles.summaryValue}>{pointLimit}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Max players</span>
                  <span className={styles.summaryValue}>{maxPlayers}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Time limit</span>
                  <span className={styles.summaryValue}>{timeLimitSeconds}s</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
