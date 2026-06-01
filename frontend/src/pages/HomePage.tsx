import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import styles from './HomePage.module.css';

function IconGame() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="8" y1="12" x2="12" y2="12" />
      <line x1="10" y1="10" x2="10" y2="14" />
      <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconGroup() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M21 20c0-2.8-1.8-5-4-5.5" />
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  function handleJoin() {
    const code = joinCode.trim();
    if (code) {
      navigate(`/join?code=${encodeURIComponent(code)}`);
    }
  }

  return (
    <PageLayout wide>
      <div className={styles.page}>

        <div className={styles.hero}>
          <span className={styles.eyebrow}>Let's Wire Together!</span>
          <h1 className={styles.title}>Party Wire</h1>
          <p className={styles.subtitle}>
            Real-time multiplayer social game. Answer questions, vote,
            compete and see who knows the group best.
          </p>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => navigate('/create-room')}>
            Create Game Room
          </Button>

          <p className={styles.orText}>or join existing room</p>

          <div className={styles.joinRow}>
            <div className={styles.joinInput}>
              <Input
                placeholder="Enter room code (e.g. ABC123)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                maxLength={8}
              />
            </div>
            <Button
              variant="secondary"
              fullWidth={false}
              onClick={handleJoin}
              disabled={!joinCode.trim()}
            >
              Join
            </Button>
          </div>
        </div>

        <div className={styles.features}>
          <Card padded={false}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}><IconGame /></span>
              <h3 className={styles.featureTitle}>Game Preview</h3>
              <p className={styles.featureText}>
                Players answer social questions about each other. Most voted
                answer wins points. Track progress on live leaderboard.
              </p>
            </div>
          </Card>

          <Card padded={false}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}><IconGroup /></span>
              <h3 className={styles.featureTitle}>Multiplayer Lobby</h3>
              <p className={styles.featureText}>
                Share invite code or link. Wait for players to join. Host
                starts game when ready. Supports 3–10 players.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </PageLayout>
  );
}
