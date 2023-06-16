package com.example.keycloaktest.util;

import com.google.gson.Gson;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Component
@NoArgsConstructor
public class MyHandler extends TextWebSocketHandler {

    private List<Map.Entry<String, WebSocketSession>> sessions = new ArrayList<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException, Exception {

        super.handleTextMessage(session, message);
        Map<String, String> value = new Gson().fromJson(message.getPayload(), Map.class);


        if (value.get("username") != null) {
            String username = value.get("username");
            Map.Entry<String, WebSocketSession> pair = new AbstractMap.SimpleEntry<>(username,
                    session);

            sessions.add(pair);
        } else {
            String sender = value.get("sender");

            for (Map.Entry<String, WebSocketSession> pair : sessions) {
                if (pair.getKey() == sender) {
                    pair.getValue().sendMessage(message);
                }
            }

        }
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        for (Map.Entry<String, WebSocketSession> pair : sessions) {
            if (pair.getValue() == session) {
                sessions.remove(pair);
                break;
            }
        }
    }

}

