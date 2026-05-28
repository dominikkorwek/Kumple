package com.kumple.dto;

import java.util.Set;

public record GameSettingsRequest(
        Integer pointLimit,
        Integer timePerAnswer,
        Set<Long> excludedCategoryIds
) {}
