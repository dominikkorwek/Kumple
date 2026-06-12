package com.kumple.service;

import com.kumple.dto.GameSettingsRequest;
import com.kumple.dto.GameStateResponse;
import com.kumple.model.GameSession;
import com.kumple.model.QuestionCategory;
import com.kumple.model.Room;
import com.kumple.model.enums.GameStatus;
import com.kumple.model.enums.RoundType;
import com.kumple.repository.GameSessionRepository;
import com.kumple.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
public class GameService {

    private final GameSessionRepository gameSessionRepository;
    private final RoomRepository roomRepository;
    private final QuestionService questionService;
    private final ScoreService scoreService;
    private final RoundService roundService;
    private final RoomService roomService;

    public GameService(
            GameSessionRepository gameSessionRepository,
            RoomRepository roomRepository,
            QuestionService questionService,
            ScoreService scoreService,
            RoundService roundService,
            RoomService roomService
    ) {
        this.gameSessionRepository = gameSessionRepository;
        this.roomRepository = roomRepository;
        this.questionService = questionService;
        this.scoreService = scoreService;
        this.roundService = roundService;
        this.roomService = roomService;
    }

    @Transactional
    public GameStateResponse updateSettings(String roomCode, GameSettingsRequest request, String hostAuthSubject) {
        roomService.assertHost(roomCode, hostAuthSubject);
        GameSession session = getOrCreateLobbySession(roomCode);
        if (session.getStatus() != GameStatus.LOBBY) {
            throw new IllegalStateException("Ustawienia można zmieniać tylko przed startem gry");
        }
        if (request.pointLimit() != null) {
            if (request.pointLimit() < 10) throw new IllegalArgumentException("Limit punktów musi być >= 10");
            session.setPointLimit(request.pointLimit());
        }
        if (request.timePerAnswer() != null) {
            if (request.timePerAnswer() < 5) throw new IllegalArgumentException("Czas odpowiedzi musi być >= 5 sekund");
            session.setTimePerAnswer(request.timePerAnswer());
        }
        if (request.excludedCategoryIds() != null) {
            List<QuestionCategory> categories = questionService.findCategories(request.excludedCategoryIds());
            session.getExcludedCategories().clear();
            session.getExcludedCategories().addAll(new HashSet<>(categories));
        }
        if (request.excludedRoundTypes() != null) {
            if (request.excludedRoundTypes().size() >= RoundType.values().length) {
                throw new IllegalArgumentException("Co najmniej jeden typ rundy musi pozostać aktywny");
            }
            session.getExcludedRoundTypes().clear();
            session.getExcludedRoundTypes().addAll(request.excludedRoundTypes());
        }
        return toState(gameSessionRepository.save(session));
    }

    @Transactional
    public GameStateResponse startGame(String roomCode, String hostAuthSubject) {
        roomService.assertHost(roomCode, hostAuthSubject);
        GameSession session = getOrCreateLobbySession(roomCode);
        if (session.getStatus() == GameStatus.FINISHED) {
            throw new IllegalStateException("Ta gra jest już zakończona");
        }
        if (session.getStatus() == GameStatus.LOBBY) {
            session.setStatus(GameStatus.IN_PROGRESS);
            session = gameSessionRepository.save(session);
            scoreService.initializeScores(session);
            roundService.createNextRound(session);
        }
        return toState(session);
    }

    @Transactional
    public GameStateResponse nextRound(String roomCode, String hostAuthSubject) {
        roomService.assertHost(roomCode, hostAuthSubject);
        GameSession session = getSession(roomCode);
        if (session.getStatus() == GameStatus.FINISHED) {
            return toState(session);
        }
        if (session.getStatus() != GameStatus.IN_PROGRESS) {
            throw new IllegalStateException("Gra nie jest uruchomiona");
        }
        if (session.getCurrentRound() != null && session.getCurrentRound().getCompletedAt() == null) {
            throw new IllegalStateException("Aktualna runda nie jest jeszcze zakończona");
        }
        roundService.createNextRound(session);
        return toState(session);
    }

    @Transactional(readOnly = true)
    public GameStateResponse getState(String roomCode) {
        return toState(getSession(roomCode));
    }

    @Transactional(readOnly = true)
    public List<QuestionCategory> getCategories() {
        return questionService.getCategories();
    }

    private GameSession getOrCreateLobbySession(String roomCode) {
        return gameSessionRepository.findByRoomCodeIgnoreCase(roomCode)
                .orElseGet(() -> {
                    Room room = roomRepository.findByCodeIgnoreCase(roomCode)
                            .orElseThrow(() -> new IllegalArgumentException("Pokój nie istnieje"));
                    return gameSessionRepository.save(new GameSession(room));
                });
    }

    private GameSession getSession(String roomCode) {
        return gameSessionRepository.findByRoomCodeIgnoreCase(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Gra dla tego pokoju nie istnieje"));
    }

    private GameStateResponse toState(GameSession session) {
        return GameStateResponse.from(session, scoreService.getRanking(session));
    }
}
