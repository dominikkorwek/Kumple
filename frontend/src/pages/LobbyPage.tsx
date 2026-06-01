import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCodeBox from '../components/lobby/RoomCodeBox';
import PlayerCard from '../components/lobby/PlayerCard';
import GameSettingsSummary from '../components/lobby/GameSettingsSummary';
import { mockRoom } from '../mocks/gameMock';
import layout from '../styles/lobbyLayout.module.css';

export default function LobbyPage() {
  const navigate = useNavigate();
  const room = mockRoom;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Personal']);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const emptySlots = room.settings.maxPlayers - room.players.length;
  const fillPct = (room.players.length / room.settings.maxPlayers) * 100;

  return (
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
                Players ({room.players.length}/{room.settings.maxPlayers})
              </h2>
              <div className={layout.progressTrack}>
                <div className={layout.progressFill} style={{ width: `${fillPct}%` }} />
              </div>
            </div>

            <div className={layout.playersGrid}>
              {room.players.map((player) => (
                <PlayerCard key={player.id} player={player} onKick={() => {}} />
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
  );
}
