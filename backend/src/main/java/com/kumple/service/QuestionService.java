package com.kumple.service;

import com.kumple.model.GameSession;
import com.kumple.model.Question;
import com.kumple.model.QuestionCategory;
import com.kumple.model.enums.RoundType;
import com.kumple.repository.QuestionCategoryRepository;
import com.kumple.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionCategoryRepository categoryRepository;
    private final SecureRandom random = new SecureRandom();

    public QuestionService(QuestionRepository questionRepository, QuestionCategoryRepository categoryRepository) {
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    public Question getRandomQuestion(GameSession session, RoundType roundType) {
        Set<Long> excludedCategoryIds = session.getExcludedCategories()
                .stream()
                .map(QuestionCategory::getId)
                .collect(java.util.stream.Collectors.toSet());

        List<Question> questions = excludedCategoryIds.isEmpty()
                ? questionRepository.findByPredefinedTrueAndRoundType(roundType)
                : questionRepository.findByPredefinedTrueAndRoundTypeAndCategoryIdNotIn(roundType, excludedCategoryIds);

        if (questions.isEmpty()) {
            questions = questionRepository.findByPredefinedTrueAndRoundType(roundType);
        }
        if (questions.isEmpty()) {
            throw new IllegalStateException("Brak pytań dla typu rundy: " + roundType);
        }
        return questions.get(random.nextInt(questions.size()));
    }

    public Question createSessionQuestion(GameSession session, String content, RoundType roundType) {
        Question question = new Question(content, roundType, null, false, session);
        return questionRepository.save(question);
    }

    public List<QuestionCategory> findCategories(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return categoryRepository.findAllById(ids);
    }

    public List<QuestionCategory> getCategories() {
        return categoryRepository.findAll();
    }
}
