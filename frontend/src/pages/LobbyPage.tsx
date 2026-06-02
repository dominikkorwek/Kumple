import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCodeBox from '../components/lobby/RoomCodeBox';
import PlayerCard from '../components/lobby/PlayerCard';
import GameSettingsSummary from '../components/lobby/GameSettingsSummary';
import Button from '../components/ui/Button';
import { mockRoom } from '../mocks/gameMock';
import type { Player } from '../types/game';
import layout from '../styles/lobbyLayout.module.css';
import styles from './LobbyPage.module.css';

export default function LobbyPage() {
  const navigate = useNavigate();
  const room = mockRoom;

  const [players, setPlayers] = useState<Player[]>(room.players);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Personal']);
  const [kickTarget, setKickTarget] = useState<Player | null>(null);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleKickRequest(id: string) {
    const player = players.find((p) => p.id === id);
    if (player) setKickTarget(player);
  }

  function confirmKick() {
    if (kickTarget) {
      setPlayers((prev) => prev.filter((p) => p.id !== kickTarget.id));
      setKickTarget(null);
    }
  }

  const emptySlots = room.settings.maxPlayers - players.length;
  const fillPct = (players.length / room.settings.maxPlayers) * 100;

  return (
    <>
      <div className={layout.page}>
        <div className={layout.columns}>

          <div className={layout.left}>
            <div className={layout.pageHeader}>
              <div className={layout.titleRow}>
                <h1 className={layout.title}>Game Lobby</h1>
                <span className={layout.statusBadge}>Waiting for players</span>
              </div>
              <p className={layout.subtitle}>
                Share the room code or invite link with your friends
              </p>
            </div>

            <RoomCodeBox code={room.code} inviteLink={room.inviteLink} />

            <div className={layout.playersSection}>
              <div className={layout.playersHeader}>
                <h2 className={layout.playersTitle}>
                  Players ({players.length}/{room.settings.maxPlayers})
                </h2>
                <div className={layout.progressTrack}>
                  <div className={layout.progressFill} style={{ width: `${fillPct}%` }} />
                </div>
              </div>

              <div className={layout.playersGrid}>
                {players.map((player) => (
                  <PlayerCard key={player.id} player={player} onKick={handleKickRequest} />
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <PlayerCard key={`empty-${i}`} />
                ))}
              </div>
            </div>
          </div>

          <div className={layout.right}>
            <GameSettingsSummary
              settings={room.settings}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              onStartGame={() => navigate('/game/question')}
              onCancel={() => navigate('/')}
            />
          </div>

        </div>
      </div>

      {kickTarget && (
        <div className={styles.overlay} onClick={() => setKickTarget(null)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <p className={styles.dialogTitle}>Kick player?</p>
            <p className={styles.dialogBody}>
              Are you sure you want to kick{' '}
              <span className={styles.dialogName}>{kickTarget.nickname}</span>{' '}
              from the lobby? They will be able to rejoin using the room code.
            </p>
            <div className={styles.dialogActions}>
              <Button variant="secondary" fullWidth={false} onClick={() => setKickTarget(null)}>
                Cancel
              </Button>
              <Button fullWidth={false} onClick={confirmKick}>
                Kick
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
