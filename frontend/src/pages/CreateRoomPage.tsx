import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './CreateRoomPage.module.css';

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');

  return (
    <PageLayout>
      <div className={styles.page}>
        <h2 className={styles.title}>Stwórz pokój</h2>
        <p className={styles.subtitle}>Podaj swój nick, żeby zacząć</p>

        <div className={styles.form}>
          <Input
            id="nickname"
            label="Twój nick"
            placeholder="np. Marek"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && nickname.trim() && navigate('/lobby')}
            autoFocus
          />

          <Button onClick={() => navigate('/lobby')} disabled={!nickname.trim()}>
            Stwórz
          </Button>

          <Button variant="ghost" onClick={() => navigate('/')}>
            Wróć
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
