package com.kumple.dto;

public record CreateRoomRequest(
        String hostNickname,
        Integer maxPlayers
) {}
