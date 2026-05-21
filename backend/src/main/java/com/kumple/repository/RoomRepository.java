package com.kumple.repository;

import com.kumple.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByCodeIgnoreCase(String code);

    void deleteByCodeIgnoreCase(String code);

    @Query("SELECT r FROM Room r JOIN r.players p WHERE p.isHost = true AND LOWER(p.nickname) = LOWER(:hostNickname)")
    Optional<Room> findByHostNickname(String hostNickname);
}
