package com.kumple.dto;

import java.util.List;

public record SubmitQuestionRequest(
        String questionContent,
        List<AnswerOptionRequest> answers,
        Boolean answersArePlayers
) {}
