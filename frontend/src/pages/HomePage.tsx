import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  return (
    <PageLayout>
      <div className={styles.page}>
        <h1 className={styles.logo}>Kumple</h1>
        <p className={styles.tagline}>Party game dla znajomych</p>

        <div className={styles.actions}>
          <Button onClick={() => navigate('/create-room')}>Stwórz pokój</Button>

          <div className={styles.divider}>lub dołącz</div>

          <Input
            placeholder="Kod pokoju"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={8}
          />
          <Button
            variant="secondary"
            onClick={() => navigate('/lobby')}
            disabled={!joinCode.trim()}
          >
            Dołącz
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
