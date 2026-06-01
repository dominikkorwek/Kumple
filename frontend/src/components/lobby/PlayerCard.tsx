import type { Player } from '../../types/game';
import PlayerAvatar from './PlayerAvatar';
import styles from './PlayerCard.module.css';

interface PlayerCardProps {
  player?: Player;
  onKick?: (id: string) => void;
}

export default function PlayerCard({ player, onKick }: PlayerCardProps) {
  if (!player) {
    return (
      <div className={[styles.card, styles.empty].join(' ')}>
        <PlayerAvatar isEmpty />
        <p className={styles.waitingText}>Waiting for player...</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {!player.isHost && onKick && (
        <button className={styles.kickBtn} onClick={() => onKick(player.id)}>
          Kick
        </button>
      )}
      <PlayerAvatar isHost={player.isHost} />
      <p className={styles.name}>
        {player.nickname}
        {player.isHost && <span className={styles.hostStar}> ⭐</span>}
      </p>
      <p className={styles.role}>{player.isHost ? 'Host' : 'Player'}</p>
      <span className={styles.onlineDot} />
    </div>
  );
}
