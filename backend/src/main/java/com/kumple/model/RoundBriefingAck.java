package com.kumple.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
        name = "round_briefing_acks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"round_id", "player_id"})
)
public class RoundBriefingAck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "round_id", nullable = false)
    private Round round;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(nullable = false)
    private Instant ackedAt = Instant.now();

    protected RoundBriefingAck() {}

    public RoundBriefingAck(Round round, Player player) {
        this.round = round;
        this.player = player;
    }

    public Long getId() { return id; }
    public Round getRound() { return round; }
    public Player getPlayer() { return player; }
    public Instant getAckedAt() { return ackedAt; }
}
