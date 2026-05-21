import { useRef, useState } from 'react'
import './App.css'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

const API = 'http://localhost:8080/api'
const WS_URL = 'http://localhost:8080/ws'

interface Player {
  id: string
  nickname: string
  isHost: boolean
}

interface Room {
  code: string
  maxPlayers: number
  currentPlayers: number
  players: Player[]
}

type View = 'home' | 'create' | 'join' | 'lobby'

function App() {
  const [view, setView] = useState<View>('home')
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [error, setError] = useState('')
  const stompRef = useRef<Client | null>(null)

  function subscribeToRoom(code: string, myPlayerId: string) {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000,
      onConnect: () => {
        client.publish({
          destination: '/app/register',
          body: JSON.stringify({ roomCode: code, playerId: myPlayerId }),
        })

        client.subscribe(`/topic/room/${code}`, (message) => {
          const data = JSON.parse(message.body)

          if (data.event === 'ROOM_CLOSED') {
            disconnectWs()
            setRoom(null)
            setPlayerId('')
            setError('Pokój został zamknięty (host wyszedł)')
            setView('home')
            return
          }

          setRoom(data as Room)
        })
      },
    })
    client.activate()
    stompRef.current = client
  }

  function disconnectWs() {
    stompRef.current?.deactivate()
    stompRef.current = null
  }

  async function createRoom() {
    setError('')
    if (!nickname.trim()) {
      setError('Wpisz nick')
      return
    }
    try {
      const res = await fetch(`${API}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostNickname: nickname.trim(), maxPlayers: 10 }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Błąd tworzenia pokoju')
        return
      }
      const data: Room = await res.json()
      const hostPlayer = data.players.find((p) => p.isHost)!
      setRoom(data)
      setPlayerId(hostPlayer.id)
      setView('lobby')
      subscribeToRoom(data.code, hostPlayer.id)
    } catch {
      setError('Nie można połączyć z serwerem')
    }
  }

  async function joinRoom() {
    setError('')
    if (!nickname.trim()) {
      setError('Wpisz nick')
      return
    }
    if (!roomCode.trim()) {
      setError('Wpisz kod pokoju')
      return
    }
    try {
      const res = await fetch(`${API}/rooms/${roomCode.trim().toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Błąd dołączania')
        return
      }
      const data = await res.json()
      setRoom(data.room)
      setPlayerId(data.player.id)
      setView('lobby')
      subscribeToRoom(data.room.code, data.player.id)
    } catch {
      setError('Nie można połączyć z serwerem')
    }
  }

  async function leaveRoom() {
    if (room && playerId) {
      try {
        await fetch(`${API}/rooms/${room.code}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId }),
        })
      } catch {
        // ignore - we're leaving anyway
      }
    }
    disconnectWs()
    setRoom(null)
    setPlayerId('')
    setRoomCode('')
    setNickname('')
    setError('')
    setView('home')
  }

  return (
    <div className="app">
      <h1>Kumple</h1>

      {error && <div className="error">{error}</div>}

      {view === 'home' && (
        <div className="menu">
          <button onClick={() => setView('create')}>Stwórz pokój</button>
          <button onClick={() => setView('join')}>Dołącz do pokoju</button>
        </div>
      )}

      {view === 'create' && (
        <div className="form">
          <input
            placeholder="Twój nick"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createRoom()}
          />
          <button onClick={createRoom}>Stwórz</button>
          <button className="secondary" onClick={() => { setError(''); setView('home') }}>Wróć</button>
        </div>
      )}

      {view === 'join' && (
        <div className="form">
          <input
            placeholder="Twój nick"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            placeholder="Kod pokoju"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
          />
          <button onClick={joinRoom}>Dołącz</button>
          <button className="secondary" onClick={() => { setError(''); setView('home') }}>Wróć</button>
        </div>
      )}

      {view === 'lobby' && room && (
        <div className="lobby">
          <div className="room-code">
            Kod pokoju: <span>{room.code}</span>
          </div>
          <div className="player-count">
            Gracze: {room.currentPlayers} / {room.maxPlayers}
          </div>
          <ul className="player-list">
            {room.players.map((p) => (
              <li key={p.id}>
                {p.nickname}
                {p.isHost && <span className="host-badge">HOST</span>}
                {p.id === playerId && <span className="you-badge">TY</span>}
              </li>
            ))}
          </ul>
          <button className="secondary" onClick={leaveRoom}>Opuść pokój</button>
        </div>
      )}
    </div>
  )
}

export default App
