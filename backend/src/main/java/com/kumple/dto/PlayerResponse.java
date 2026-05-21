package com.kumple.dto;

import com.kumple.model.Player;

public record PlayerResponse(
        String id,
        String nickname,
        boolean isHost
) {
    public static PlayerResponse from(Player player) {
        return new PlayerResponse(player.getPlayerId(), player.getNickname(), player.isHost());
    }
}
