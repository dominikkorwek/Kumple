package com.kumple.dto;

import com.kumple.model.Round;
import com.kumple.model.enums.RoundStatus;
import com.kumple.model.enums.RoundType;

import java.util.List;

public record RoundResponse(
        Long id,
        int roundNumber,
        RoundType roundType,
        RoundStatus status,
        QuestionResponse question,
        PlayerResponse selectedPlayer,
        AnswerResponse winningAnswer,
        List<AnswerResponse> answers,
        boolean tiebreakRevote,
        List<String> briefingReadyPlayerIds,
        List<PlayerAnswerResponse> playerAnswers
) {
    public static RoundResponse from(Round round) {
        return from(round, List.of(), List.of());
    }

    public static RoundResponse from(Round round, List<String> briefingReadyPlayerIds) {
        return from(round, briefingReadyPlayerIds, List.of());
    }

    public static RoundResponse from(Round round, List<String> briefingReadyPlayerIds, List<PlayerAnswerResponse> playerAnswers) {
        if (round == null) return null;
        return new RoundResponse(
                round.getId(),
                round.getRoundNumber(),
                round.getRoundType(),
                round.getStatus(),
                QuestionResponse.from(round.getQuestion()),
                round.getSelectedPlayer() != null ? PlayerResponse.from(round.getSelectedPlayer()) : null,
                round.getWinningAnswer() != null ? AnswerResponse.from(round.getWinningAnswer()) : null,
                round.getAnswers().stream().map(AnswerResponse::from).toList(),
                round.isTiebreakRevote(),
                briefingReadyPlayerIds != null ? briefingReadyPlayerIds : List.of(),
                playerAnswers != null ? playerAnswers : List.of()
        );
    }
}
