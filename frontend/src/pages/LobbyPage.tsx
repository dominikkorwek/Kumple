import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { mockRoom } from '../mocks/gameMock';
import styles from './LobbyPage.module.css';

export default function LobbyPage() {
  const navigate = useNavigate();
  const room = mockRoom;
  const isHost = true;

  return (
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.codeLabel}>Kod pokoju</p>
          <p className={styles.code}>{room.code}</p>
          <p className={styles.count}>
            {room.players.length} / {room.maxPlayers} graczy
          </p>
        </div>

        <Card>
          <ul className={styles.playerList}>
            {room.players.map((player) => (
              <li key={player.id} className={styles.playerRow}>
                <span className={styles.nickname}>{player.nickname}</span>
                <div className={styles.badges}>
                  {player.isHost && <span className={styles.badge}>HOST</span>}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className={styles.footer}>
          {isHost ? (
            <Button onClick={() => navigate('/game/question')}>Rozpocznij grę</Button>
          ) : (
            <p className={styles.waiting}>Czekanie na hosta...</p>
          )}
          <Button variant="ghost" onClick={() => navigate('/')}>
            Opuść pokój
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
