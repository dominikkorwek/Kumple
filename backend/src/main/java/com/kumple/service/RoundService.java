package com.kumple.service;

import com.kumple.dto.AnswerOptionRequest;
import com.kumple.dto.RoundResponse;
import com.kumple.dto.SubmitAnswerRequest;
import com.kumple.dto.SubmitQuestionRequest;
import com.kumple.model.*;
import com.kumple.model.enums.GameStatus;
import com.kumple.model.enums.RoundStatus;
import com.kumple.model.enums.RoundType;
import com.kumple.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class RoundService {

    private final RoundRepository roundRepository;
    private final AnswerRepository answerRepository;
    private final PlayerAnswerRepository playerAnswerRepository;
    private final PlayerRepository playerRepository;
    private final GameSessionRepository gameSessionRepository;
    private final QuestionService questionService;
    private final ScoreService scoreService;

    public RoundService(
            RoundRepository roundRepository,
            AnswerRepository answerRepository,
            PlayerAnswerRepository playerAnswerRepository,
            PlayerRepository playerRepository,
            GameSessionRepository gameSessionRepository,
            QuestionService questionService,
            ScoreService scoreService
    ) {
        this.roundRepository = roundRepository;
        this.answerRepository = answerRepository;
        this.playerAnswerRepository = playerAnswerRepository;
        this.playerRepository = playerRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.questionService = questionService;
        this.scoreService = scoreService;
    }

    @Transactional
    public Round createNextRound(GameSession session) {
        int roundNumber = session.getCurrentRoundNumber() + 1;
        RoundType roundType = chooseRoundType(roundNumber);
        Player selectedPlayer = roundType == RoundType.VOTE_PERSON ? null : pickPlayer(session, roundNumber);
        Question question = null;
        RoundStatus status = RoundStatus.WAITING_FOR_ANSWERS;

        if (roundType == RoundType.GUESS_PLAYER_ANSWER || roundType == RoundType.REUSE_QUESTION) {
            question = questionService.getRandomQuestion(session, RoundType.GUESS_PLAYER_ANSWER);
            status = RoundStatus.WAITING_FOR_QUESTION;
        } else if (roundType == RoundType.VOTE_PERSON || roundType == RoundType.BEST_ANSWER) {
            question = questionService.getRandomQuestion(session, roundType);
        } else if (roundType == RoundType.PLAYER_CREATES_QUESTION) {
            status = RoundStatus.WAITING_FOR_QUESTION;
        }

        Round round = roundRepository.save(new Round(session, roundType, roundNumber, selectedPlayer, question, status));

        if (roundType == RoundType.VOTE_PERSON) {
            createPlayerAnswers(round);
            round = roundRepository.save(round);
        }

        session.setCurrentRound(round);
        session.setCurrentRoundNumber(roundNumber);
        gameSessionRepository.save(session);
        return round;
    }

    @Transactional
    public RoundResponse submitQuestion(Long roundId, SubmitQuestionRequest request) {
        Round round = getRound(roundId);
        if (round.getStatus() != RoundStatus.WAITING_FOR_QUESTION) {
            throw new IllegalStateException("Ta runda nie oczekuje teraz na pytanie lub warianty odpowiedzi");
        }

        if (hasText(request.questionContent())) {
            Question question = questionService.createSessionQuestion(
                    round.getGameSession(),
                    request.questionContent().trim(),
                    round.getRoundType()
            );
            round.setQuestion(question);
        }

        if (Boolean.TRUE.equals(request.answersArePlayers())) {
            createPlayerAnswers(round);
        } else if (request.answers() != null) {
            for (AnswerOptionRequest option : request.answers()) {
                if (hasText(option.content())) {
                    Answer answer = new Answer(round, option.content().trim(), null, null, Boolean.TRUE.equals(option.correct()));
                    round.getAnswers().add(answerRepository.save(answer));
                }
            }
        }

        if (round.getQuestion() == null) {
            throw new IllegalArgumentException("Runda musi mieć pytanie");
        }
        if (round.getAnswers().isEmpty()) {
            throw new IllegalArgumentException("Runda musi mieć przynajmniej jedną odpowiedź");
        }

        round.setStatus(RoundStatus.WAITING_FOR_ANSWERS);
        return RoundResponse.from(roundRepository.save(round));
    }

    @Transactional
    public RoundResponse submitAnswer(Long roundId, SubmitAnswerRequest request) {
        Round round = getRound(roundId);
        Player player = playerRepository.findByPlayerId(request.playerId())
                .orElseThrow(() -> new IllegalArgumentException("Gracz nie istnieje"));

        if (request.selectedAnswerId() != null) {
            return chooseBestAnswer(round, player, request.selectedAnswerId());
        }

        if (round.getStatus() != RoundStatus.WAITING_FOR_ANSWERS) {
            throw new IllegalStateException("Ta runda nie przyjmuje teraz odpowiedzi");
        }
        playerAnswerRepository.findByRoundIdAndPlayerPlayerId(roundId, request.playerId()).ifPresent(existing -> {
            throw new IllegalArgumentException("Ten gracz już odpowiedział w tej rundzie");
        });

        Answer answer = null;
        String freeText = null;
        if (hasText(request.freeText())) {
            freeText = request.freeText().trim();
            answer = answerRepository.save(new Answer(round, freeText, player, null, false));
            round.getAnswers().add(answer);
        } else if (request.answerId() != null) {
            answer = answerRepository.findById(request.answerId())
                    .orElseThrow(() -> new IllegalArgumentException("Odpowiedź nie istnieje"));
            if (!Objects.equals(answer.getRound().getId(), round.getId())) {
                throw new IllegalArgumentException("Odpowiedź nie należy do tej rundy");
            }
            answer.incrementVoteCount();
            answerRepository.save(answer);
        } else {
            throw new IllegalArgumentException("Brak odpowiedzi");
        }

        PlayerAnswer playerAnswer = new PlayerAnswer(round, player, answer, freeText);
        round.getPlayerAnswers().add(playerAnswerRepository.save(playerAnswer));

        if (round.getRoundType() == RoundType.BEST_ANSWER && hasAllExpectedAnswers(round)) {
            round.setStatus(RoundStatus.REVEALING);
        } else if (round.getRoundType() != RoundType.BEST_ANSWER && hasAllExpectedAnswers(round)) {
            completeRound(round);
        }

        return RoundResponse.from(roundRepository.save(round));
    }

    @Transactional(readOnly = true)
    public RoundResponse getRoundState(Long roundId) {
        return RoundResponse.from(getRound(roundId));
    }

    @Transactional(readOnly = true)
    public String getRoomCode(Long roundId) {
        return getRound(roundId).getGameSession().getRoom().getCode();
    }

    private RoundResponse chooseBestAnswer(Round round, Player player, Long selectedAnswerId) {
        if (round.getRoundType() != RoundType.BEST_ANSWER) {
            throw new IllegalStateException("Wybor najlepszej odpowiedzi dotyczy tylko rundy BEST_ANSWER");
        }
        if (round.getSelectedPlayer() == null || !round.getSelectedPlayer().getPlayerId().equals(player.getPlayerId())) {
            throw new IllegalArgumentException("Tylko wskazany gracz może wybrać najlepszą odpowiedź");
        }
        if (round.getStatus() != RoundStatus.REVEALING) {
            throw new IllegalStateException("Najpierw pozostali gracze muszą przesłać swoje odpowiedzi");
        }

        Answer winner = answerRepository.findById(selectedAnswerId)
                .orElseThrow(() -> new IllegalArgumentException("Odpowiedź nie istnieje"));
        if (!Objects.equals(winner.getRound().getId(), round.getId())) {
            throw new IllegalArgumentException("Odpowiedź nie należy do tej rundy");
        }

        winner.setCorrect(true);
        round.setWinningAnswer(winner);
        if (winner.getAuthor() != null) {
            scoreService.addPoint(round.getGameSession(), winner.getAuthor());
        }
        finishRound(round);
        return RoundResponse.from(roundRepository.save(round));
    }

    private void completeRound(Round round) {
        if (round.getRoundType() == RoundType.GUESS_PLAYER_ANSWER || round.getRoundType() == RoundType.REUSE_QUESTION) {
            List<Answer> winners = round.getAnswers().stream().filter(Answer::isCorrect).toList();
            winners.stream().findFirst().ifPresent(round::setWinningAnswer);
            awardPlayersWhoSelected(round, winners);
        } else {
            int maxVotes = round.getAnswers().stream().mapToInt(Answer::getVoteCount).max().orElse(0);
            List<Answer> winners = round.getAnswers().stream()
                    .filter(answer -> answer.getVoteCount() == maxVotes && maxVotes > 0)
                    .toList();
            winners.stream().findFirst().ifPresent(round::setWinningAnswer);
            awardPlayersWhoSelected(round, winners);
        }
        finishRound(round);
    }

    private void finishRound(Round round) {
        round.setStatus(RoundStatus.COMPLETED);
        round.setCompletedAt(Instant.now());
        if (scoreService.hasReachedPointLimit(round.getGameSession())) {
            round.getGameSession().setStatus(GameStatus.FINISHED);
        }
        gameSessionRepository.save(round.getGameSession());
    }

    private void awardPlayersWhoSelected(Round round, List<Answer> winners) {
        List<Long> winnerIds = winners.stream().map(Answer::getId).toList();
        for (PlayerAnswer playerAnswer : playerAnswerRepository.findByRoundId(round.getId())) {
            if (playerAnswer.getAnswer() != null && winnerIds.contains(playerAnswer.getAnswer().getId())) {
                playerAnswer.setAwardedPoint(true);
                playerAnswerRepository.save(playerAnswer);
                scoreService.addPoint(round.getGameSession(), playerAnswer.getPlayer());
            }
        }
    }

    private boolean hasAllExpectedAnswers(Round round) {
        long expected = round.getGameSession().getRoom().getPlayers().stream()
                .filter(player -> shouldAnswer(round, player))
                .count();
        long actual = playerAnswerRepository.findByRoundId(round.getId()).size();
        return expected > 0 && actual >= expected;
    }

    private boolean shouldAnswer(Round round, Player player) {
        if (round.getRoundType() == RoundType.VOTE_PERSON) return true;
        return round.getSelectedPlayer() == null || !round.getSelectedPlayer().getPlayerId().equals(player.getPlayerId());
    }

    private void createPlayerAnswers(Round round) {
        for (Player player : round.getGameSession().getRoom().getPlayers()) {
            Answer answer = new Answer(round, player.getNickname(), null, player, false);
            round.getAnswers().add(answerRepository.save(answer));
        }
    }

    private RoundType chooseRoundType(int roundNumber) {
        RoundType[] values = RoundType.values();
        return values[(roundNumber - 1) % values.length];
    }

    private Player pickPlayer(GameSession session, int roundNumber) {
        List<Player> players = session.getRoom().getPlayers().stream()
                .sorted(Comparator.comparing(Player::getJoinedAt))
                .toList();
        if (players.isEmpty()) {
            throw new IllegalStateException("Nie można rozpocząć rundy bez graczy");
        }
        return players.get((roundNumber - 1) % players.size());
    }

    private Round getRound(Long roundId) {
        return roundRepository.findById(roundId)
                .orElseThrow(() -> new IllegalArgumentException("Runda nie istnieje"));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
