package com.kumple.dto;

import com.kumple.model.Answer;

public record AnswerResponse(
        Long id,
        String content,
        PlayerResponse author,
        PlayerResponse targetPlayer,
        boolean correct,
        int voteCount
) {
    public static AnswerResponse from(Answer answer) {
        return new AnswerResponse(
                answer.getId(),
                answer.getContent(),
                answer.getAuthor() != null ? PlayerResponse.from(answer.getAuthor()) : null,
                answer.getTargetPlayer() != null ? PlayerResponse.from(answer.getTargetPlayer()) : null,
                answer.isCorrect(),
                answer.getVoteCount()
        );
    }
}
