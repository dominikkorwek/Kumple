package com.kumple.repository;

import com.kumple.model.RoundBriefingAck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoundBriefingAckRepository extends JpaRepository<RoundBriefingAck, Long> {
    List<RoundBriefingAck> findByRoundId(Long roundId);
    boolean existsByRoundIdAndPlayerPlayerId(Long roundId, String playerId);
    void deleteByRoundGameSessionId(Long gameSessionId);
}
