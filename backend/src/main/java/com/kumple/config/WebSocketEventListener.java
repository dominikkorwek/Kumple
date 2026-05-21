package com.kumple.config;

import com.kumple.dto.RoomResponse;
import com.kumple.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Component
public class WebSocketEventListener {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(RoomService roomService, SimpMessagingTemplate messagingTemplate) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();

        roomService.getSession(sessionId).ifPresent(session -> {
            log.info("WebSocket disconnect: session={}, room={}, player={}",
                    sessionId, session.roomCode(), session.playerId());

            boolean roomDestroyed = roomService.leaveRoom(session.roomCode(), session.playerId());
            String topic = "/topic/room/" + session.roomCode();

            if (roomDestroyed) {
                messagingTemplate.convertAndSend(topic, Map.of("event", "ROOM_CLOSED"));
            } else {
                roomService.getRoom(session.roomCode()).ifPresent(room ->
                        messagingTemplate.convertAndSend(topic, RoomResponse.from(room))
                );
            }

            roomService.unregisterSession(sessionId);
        });
    }
}
