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
import java.util.concurrent.CopyOnWriteArrayList;


@Component
@NoArgsConstructor
public class MyHandler extends TextWebSocketHandler {




    private List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();




    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException, Exception {

        Map<String, String> value = new Gson().fromJson(message.getPayload(), Map.class);
        super.handleTextMessage(session,message);
        for (WebSocketSession webSocketSession: sessions){
            webSocketSession.sendMessage(message);//chatId content sender
        }

    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception{
        super.afterConnectionClosed(session, status);
        sessions.remove(session);
    }





}