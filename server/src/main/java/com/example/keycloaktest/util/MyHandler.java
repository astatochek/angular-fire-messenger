package com.example.keycloaktest.util;

import ch.qos.logback.core.joran.ParamModelHandler;
import ch.qos.logback.core.joran.sanity.Pair;
import com.google.gson.Gson;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;


@Component
@NoArgsConstructor
public class MyHandler extends TextWebSocketHandler {




    private List<HashMap<String,WebSocketSession>> sessions = new CopyOnWriteArrayList<>();




    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException, Exception {

        Map<String, String> value = new Gson().fromJson(message.getPayload(), Map.class);
        super.handleTextMessage(session,message);
        for (HashMap<String, WebSocketSession> webSocketSession: sessions){
            webSocketSession.get("test").sendMessage(message);//chatId content sender
        }

    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        HashMap<String, WebSocketSession> map = new HashMap<>();
        map.put("test", session);
        sessions.add(map);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception{
        super.afterConnectionClosed(session, status);
        HashMap<String, WebSocketSession> map = new HashMap<>();
        map.put("test", session);
        sessions.remove(map);
    }





}