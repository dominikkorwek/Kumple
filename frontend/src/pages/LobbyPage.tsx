import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCodeBox from '../components/lobby/RoomCodeBox';
import PlayerCard from '../components/lobby/PlayerCard';
import GameSettingsSummary from '../components/lobby/GameSettingsSummary';
import Button from '../components/ui/Button';
import { leaveRoom, startGame, getGameState } from '../services/api';
import { connectRoom, disconnect } from '../services/stomp';
import { usePlayer } from '../context/PlayerContext';
import type { PlayerResponse, RoomResponse, GameStateResponse, GameStatus } from '../types/api';
import type { GameSettings, Player } from '../types/game';
import layout from '../styles/lobbyLayout.module.css';
import styles from './LobbyPage.module.css';

function toGameSettings(gs: GameStateResponse): GameSettings {
  return {
    maxPlayers: gs.room.maxPlayers,
    pointLimit: gs.pointLimit,
    timePerAnswer: gs.timePerAnswer,
  };
}

function toPlayer(p: PlayerResponse, ownId?: string, ownAvatar?: { animalId: string; color: string }): Player {
  const isSelf = ownId === p.id && ownAvatar;
  return {
    id: p.id,
    nickname: p.nickname,
    isHost: p.isHost,
    avatarAnimal: p.avatarAnimal ?? (isSelf ? ownAvatar.animalId : 'cat'),
    avatarColor: p.avatarColor ?? (isSelf ? ownAvatar.color : '#f97316'),
  };
}

export default function LobbyPage() {
  const navigate = useNavigate();
  const { session } = usePlayer();

  const roomCode = session?.roomCode ?? '';
  const playerId = session?.playerId ?? '';
  const isHost = session?.isHost ?? false;
  const ownAvatar = session?.avatar;

  const mapPlayers = useCallback(
    (list: PlayerResponse[]) => list.map((p) => toPlayer(p, playerId, ownAvatar)),
    [playerId, ownAvatar],
  );

  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>({ maxPlayers: 8, pointLimit: 100, timePerAnswer: 30 });
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Personal']);
  const [kickTarget, setKickTarget] = useState<Player | null>(null);
  const [starting, setStarting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleMessage = useCallback(
    (msg: RoomResponse | GameStateResponse | { event: string }) => {
      if ('event' in msg && msg.event === 'ROOM_CLOSED') {
        navigate('/');
        return;
      }
      if ('status' in msg) {
        const gs = msg as GameStateResponse;
        setPlayers(mapPlayers(gs.room.players));
        setSettings(toGameSettings(gs));
        setMaxPlayers(gs.room.maxPlayers);
        const status: GameStatus = gs.status;
        if (status === 'IN_PROGRESS') navigate('/game/question');
        return;
      }
      if ('players' in msg) {
        const rm = msg as RoomResponse;
        setPlayers(mapPlayers(rm.players));
        setMaxPlayers(rm.maxPlayers);
      }
    },
    [navigate, mapPlayers]
  );

  useEffect(() => {
    if (!roomCode) return;

    getGameState(roomCode)
      .then((gs) => {
        setPlayers(mapPlayers(gs.room.players));
        setSettings(toGameSettings(gs));
        setMaxPlayers(gs.room.maxPlayers);
      })
      .catch(() => {});

    connectRoom(roomCode, playerId, handleMessage, () => setConnected(true));

    return () => { disconnect(); };
  }, [roomCode, playerId, handleMessage, mapPlayers]);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleKickRequest(id: string) {
    const player = players.find((p) => p.id === id);
    if (player) setKickTarget(player);
  }

  async function confirmKick() {
    if (!kickTarget) return;
    try {
      await leaveRoom(roomCode, kickTarget.id);
    } catch {
      // player will be removed via WS anyway
    }
    setKickTarget(null);
  }

  async function handleStartGame() {
    setStarting(true);
    try {
      await startGame(roomCode);
    } catch {
      setStarting(false);
    }
  }

  const emptySlots = Math.max(0, maxPlayers - players.length);
  const fillPct = maxPlayers > 0 ? (players.length / maxPlayers) * 100 : 0;

  return (
    <>
      <div className={layout.page}>
        <div className={layout.columns}>

          <div className={layout.left}>
            <div className={layout.pageHeader}>
              <div className={layout.titleRow}>
                <h1 className={layout.title}>Game Lobby</h1>
                <span className={layout.statusBadge}>
                  {connected ? 'Live' : 'Connecting…'}
                </span>
              </div>
              <p className={layout.subtitle}>
                Share the room code or invite link with your friends
              </p>
            </div>

            <RoomCodeBox code={roomCode} />

            <div className={layout.playersSection}>
              <div className={layout.playersHeader}>
                <h2 className={layout.playersTitle}>
                  Players ({players.length}/{maxPlayers})
                </h2>
                <div className={layout.progressTrack}>
                  <div className={layout.progressFill} style={{ width: `${fillPct}%` }} />
                </div>
              </div>

              <div className={layout.playersGrid}>
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onKick={isHost && !player.isHost ? handleKickRequest : undefined}
                  />
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <PlayerCard key={`empty-${i}`} />
                ))}
              </div>
            </div>
          </div>

          <div className={layout.right}>
            <GameSettingsSummary
              settings={settings}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              onStartGame={isHost ? handleStartGame : undefined}
              onCancel={() => navigate('/')}
              isHost={isHost}
              starting={starting}
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
