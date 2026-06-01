# Frontend context

Project: Party Wire Game - a web-based party game.

At this stage, we are building a mocked frontend without backend integration.

Stack:
- Vite
- React
- TypeScript
- React Router
- plain CSS / CSS Modules
- do not add new libraries without asking first

Rules:
- Do not modify the backend.
- Do not make HTTP requests.
- Do not implement WebSockets yet.
- Keep all mock data locally in src/mocks.
- Keep TypeScript types in src/types.
- Keep page-level views in src/pages.
- Keep reusable components in src/components.
- The UI should be dark, minimalistic, and use an orange accent color for primary actions.
- The code should be simple, readable, and easy to connect to the backend later.

Main screens:
- HomePage
- CreateRoomPage
- LobbyPage
- QuestionPage
- RoundResultsPage
- PodiumPage
- GameSummaryPage

Mocked flow:
HomePage -> CreateRoomPage -> LobbyPage -> QuestionPage -> RoundResultsPage -> PodiumPage -> GameSummaryPage

Frontend responsibility:
- Display the game UI based on mocked data.
- Simulate the main user flow.
- Use local component state only where needed.
- Avoid adding complex state management.
- Prepare the structure so that mock data can later be replaced with API data.

Project notes:
- The host can create a game room.
- Guest players can join using a room code.
- The lobby displays players, room settings, and a start game action.
- During the game, players answer questions.
- After each round, the app displays round results and the current ranking.
- At the end, the app displays the podium and the final game summary.