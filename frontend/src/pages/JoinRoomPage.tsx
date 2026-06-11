import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import AvatarPicker, { AvatarDisplay, AVATAR_COLORS } from '../components/join/AvatarPicker';
import type { AvatarConfig } from '../components/join/AvatarPicker';
import { getRoomByCode, joinRoom, createRoom, updateSettings } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { PENDING_SETTINGS_KEY } from './CreateRoomPage';
import type { PendingRoomSettings } from './CreateRoomPage';
import type { RoomResponse } from '../types/api';
import Toast from '../components/ui/Toast';
import layout from '../styles/lobbyLayout.module.css';
import styles from './JoinRoomPage.module.css';

function PersonIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    </svg>
  );
}

function DoorIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.2 1.8-4 4-4s4 1.8 4 4v1z" />
    </svg>
  );
}

const DEFAULT_AVATAR: AvatarConfig = {
  animalId: 'cat',
  color: AVATAR_COLORS[0].value,
};

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setSession } = usePlayer();

  const code = (params.get('code') ?? '').toUpperCase();
  const isHost = params.get('host') === 'true';

  const [pendingSettings, setPendingSettings] = useState<PendingRoomSettings | null>(null);
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [roomError, setRoomError] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isHost) {
      const raw = sessionStorage.getItem(PENDING_SETTINGS_KEY);
      if (raw) {
        try { setPendingSettings(JSON.parse(raw) as PendingRoomSettings); } catch { /* ignore */ }
      }
      return;
    }
    if (!code) {
      setRoomError('No room code provided');
      return;
    }
    getRoomByCode(code)
      .then(setRoom)
      .catch(() => setRoomError('Room not found'));
  }, [code, isHost]);

  async function handleJoin() {
    const trimmed = nickname.trim();
    if (!trimmed) { setToast('Wpisz swój nickname, aby kontynuować'); return; }
    if (trimmed.length < 2) { setToast('Nickname musi mieć co najmniej 2 znaki'); return; }
    if (trimmed.length > 30) { setToast('Nickname może mieć maksymalnie 30 znaków'); return; }
    setLoading(true);
    setApiError('');

    try {
      if (isHost) {
        const settings = pendingSettings ?? { maxPlayers: 8, pointLimit: 100, timePerAnswer: 30, excludedCategoryIds: [] };
        const { player, room: newRoom } = await createRoom(trimmed, settings.maxPlayers, avatar.animalId, avatar.color);
        await updateSettings(newRoom.code, {
          pointLimit: settings.pointLimit,
          timePerAnswer: settings.timePerAnswer,
          excludedCategoryIds: settings.excludedCategoryIds,
        });
        sessionStorage.removeItem(PENDING_SETTINGS_KEY);
        setSession({
          playerId: player.id,
          nickname: player.nickname,
          roomCode: newRoom.code,
          isHost: true,
          avatar: {
            animalId: player.avatarAnimal ?? avatar.animalId,
            color: player.avatarColor ?? avatar.color,
          },
        });
        navigate('/lobby');
        return;
      }

      const { player } = await joinRoom(code, trimmed, avatar.animalId, avatar.color);
      setSession({
        playerId: player.id,
        nickname: player.nickname,
        roomCode: code,
        isHost: false,
        avatar: {
          animalId: player.avatarAnimal ?? avatar.animalId,
          color: player.avatarColor ?? avatar.color,
        },
      });
      navigate('/lobby');
    } catch (e) {
      setApiError(e instanceof Error ? e.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  }

  const isFull = room ? room.currentPlayers >= room.maxPlayers : false;
  const occupiedSlots = room?.players ?? [];
  const previewMaxPlayers = isHost ? (pendingSettings?.maxPlayers ?? 8) : (room?.maxPlayers ?? 0);
  const emptySlots = isHost
    ? Math.max(0, previewMaxPlayers - 1)
    : (room ? Math.max(0, room.maxPlayers - room.currentPlayers - 1) : 0);

  return (
    <>
    <div className={layout.page}>
      <div className={layout.columns}>

        <div className={layout.left}>

          <button className={styles.backLink} onClick={() => navigate(isHost ? '/create-room' : '/')}>
            ← {isHost ? 'Back to room setup' : 'Back to home'}
          </button>

          <div className={styles.pageHeader}>
            <span className={styles.badge}>
              <DoorIcon />
              {isHost ? 'Your Profile' : 'Join Room'}
            </span>
            <h1 className={styles.title}>{isHost ? 'Set Up Your Profile' : 'Join Game Room'}</h1>
            <p className={styles.subtitle}>
              {isHost
                ? 'Enter your nickname and pick an avatar — your room will be created when you continue'
                : 'Enter your nickname and pick an avatar to join the session'}
            </p>
          </div>

          {roomError && <p className={styles.errorText}>{roomError}</p>}

          <Card padded={false}>
            <div className={styles.roomConfirm}>
              <span className={styles.roomLabel}>Room code</span>
              <span className={styles.roomCode}>{code || '—'}</span>
              {isFull && !isHost && <span className={styles.fullBadge}>Room full</span>}
            </div>
          </Card>

          <AvatarPicker value={avatar} onChange={setAvatar} />

          <Input
            label="Your nickname"
            placeholder="e.g. Marek"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            maxLength={30}
            autoFocus
          />

          {apiError && <p className={styles.errorText}>{apiError}</p>}

          <Button
            onClick={handleJoin}
            disabled={loading || (!isHost && isFull)}
          >
            {loading ? (isHost ? 'Creating room…' : 'Joining…') : isHost ? 'Create Room & Enter Lobby' : 'Join Game'}
          </Button>

        </div>

        <div className={layout.right}>

          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Room Preview</p>

              <div className={styles.playerCount}>
                <PersonIcon size={16} />
                <span>
                  {isHost
                    ? `1 / ${previewMaxPlayers} players`
                    : room ? `${room.currentPlayers + 1} / ${room.maxPlayers} players` : '— / —'}
                </span>
              </div>

              <div className={styles.playerList}>

                {occupiedSlots.map((p) => (
                  <div key={p.id} className={styles.playerRow}>
                    <AvatarDisplay
                      animalId={p.avatarAnimal ?? 'cat'}
                      color={p.avatarColor ?? '#f97316'}
                      size={28}
                    />
                    <span className={styles.playerName}>{p.nickname}</span>
                    {p.isHost && <span className={styles.hostTag}>Host</span>}
                  </div>
                ))}

                <div className={`${styles.playerRow} ${styles.youRow}`}>
                  <AvatarDisplay animalId={avatar.animalId} color={avatar.color} size={28} />
                  <span className={styles.playerName}>{nickname.trim() || 'You'}</span>
                  <span className={styles.youTag}>{isHost ? 'Host' : 'Joining…'}</span>
                </div>

                {emptySlots > 0 &&
                  Array.from({ length: Math.min(emptySlots, 4) }).map((_, i) => (
                    <div key={`empty-${i}`} className={`${styles.playerRow} ${styles.emptyRow}`}>
                      <div className={`${styles.playerAvatar} ${styles.emptyAvatar}`}>
                        <PersonIcon size={14} />
                      </div>
                      <span className={styles.emptySlot}>Waiting for player…</span>
                    </div>
                  ))}

              </div>
            </div>
          </Card>

          {(isHost ? pendingSettings : room) && (
            <Card padded={false}>
              <div className={styles.panel}>
                <p className={styles.panelLabel}>Game Settings</p>
                <div className={styles.settingsList}>
                  <div className={styles.settingRow}>
                    <span className={styles.settingKey}>Points to win</span>
                    <span className={styles.settingVal}>
                      {isHost ? pendingSettings!.pointLimit : '—'}
                    </span>
                  </div>
                  <div className={styles.settingRow}>
                    <span className={styles.settingKey}>Time per answer</span>
                    <span className={styles.settingVal}>
                      {isHost ? `${pendingSettings!.timePerAnswer}s` : '—'}
                    </span>
                  </div>
                  <div className={styles.settingRow}>
                    <span className={styles.settingKey}>Max players</span>
                    <span className={styles.settingVal}>{previewMaxPlayers}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>

    {toast && <Toast message={toast} onDismiss={() => setToast('')} />}
    </>
  );
}
