import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockRoom } from '../mocks/gameMock';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import AvatarPicker, { AvatarDisplay, AVATAR_COLORS } from '../components/join/AvatarPicker';
import type { AvatarConfig } from '../components/join/AvatarPicker';
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

  const code = params.get('code') ?? mockRoom.code;
  const isHost = params.get('host') === 'true';
  const room = mockRoom;

  const [nickname, setNickname] = useState('');
  const [nickError, setNickError] = useState('');
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);

  function handleJoin() {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setNickError('Nickname is required');
      return;
    }
    if (trimmed.length < 2) {
      setNickError('Nickname must be at least 2 characters');
      return;
    }
    navigate('/lobby');
  }

  const isFull = room.players.length >= room.settings.maxPlayers;
  const emptySlots = room.settings.maxPlayers - room.players.length - 1;

  return (
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
                ? 'Pick an avatar and nickname before entering your lobby'
                : 'Enter your nickname and pick an avatar to join the session'}
            </p>
          </div>

          <Card padded={false}>
            <div className={styles.roomConfirm}>
              <span className={styles.roomLabel}>Room code</span>
              <span className={styles.roomCode}>{code}</span>
              {isFull && <span className={styles.fullBadge}>Room full</span>}
            </div>
          </Card>

          <AvatarPicker value={avatar} onChange={setAvatar} />

          <Input
            label="Your nickname"
            placeholder="e.g. Marek"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (nickError) setNickError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            error={!!nickError}
            helperText={nickError || undefined}
            maxLength={20}
            autoFocus
          />

          <Button onClick={handleJoin} disabled={!nickname.trim() || (!isHost && isFull)}>
            {isHost ? 'Enter Lobby' : 'Join Game'}
          </Button>

        </div>

        <div className={layout.right}>

          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Room Preview</p>

              <div className={styles.playerCount}>
                <PersonIcon size={16} />
                <span>
                  {room.players.length + 1} / {room.settings.maxPlayers} players joined
                </span>
              </div>

              <div className={styles.playerList}>

                {room.players.map((p) => (
                  <div key={p.id} className={styles.playerRow}>
                    <div className={styles.playerAvatar}>
                      <PersonIcon size={14} />
                    </div>
                    <span className={styles.playerName}>{p.nickname}</span>
                    {p.isHost && <span className={styles.hostTag}>Host</span>}
                  </div>
                ))}

                <div className={`${styles.playerRow} ${styles.youRow}`}>
                  <AvatarDisplay
                    animalId={avatar.animalId}
                    color={avatar.color}
                    size={28}
                  />
                  <span className={styles.playerName}>
                    {nickname.trim() || 'You'}
                  </span>
                  <span className={styles.youTag}>{isHost ? 'Host' : 'Joining…'}</span>
                </div>

                {emptySlots > 0 &&
                  Array.from({ length: emptySlots }).map((_, i) => (
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

          <Card padded={false}>
            <div className={styles.panel}>
              <p className={styles.panelLabel}>Game Settings</p>
              <div className={styles.settingsList}>
                <div className={styles.settingRow}>
                  <span className={styles.settingKey}>Time per round</span>
                  <span className={styles.settingVal}>{room.settings.timeLimitSeconds}s</span>
                </div>
                <div className={styles.settingRow}>
                  <span className={styles.settingKey}>Max players</span>
                  <span className={styles.settingVal}>{room.settings.maxPlayers}</span>
                </div>
                <div className={styles.settingRow}>
                  <span className={styles.settingKey}>Total rounds</span>
                  <span className={styles.settingVal}>{room.settings.totalRounds}</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
