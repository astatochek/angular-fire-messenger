package com.example.keycloaktest.util;

import ch.qos.logback.core.joran.ParamModelHandler;
import ch.qos.logback.core.joran.sanity.Pair;
import com.example.keycloaktest.dto.MessageDto;
import com.example.keycloaktest.dto.UserInfoDto;
import com.google.gson.Gson;
import lombok.NoArgsConstructor;
import org.json.JSONObject;
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




    private List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();




    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException, Exception {

        super.handleTextMessage(session,message);

        //Map<String, String> value = new Gson().fromJson(message.getPayload(), Map.class);
        JSONObject value = new JSONObject(message.getPayload());
        MessageDto messageDto = new MessageDto();
        messageDto.setMessageId(0L);
        messageDto.setDate(new Date());
        messageDto.setContent(value.get("content").toString());
        messageDto.setChatId(Long.parseLong(value.get("chatId").toString()));
        UserInfoDto sender = new UserInfoDto();
        sender.setUsername(value.get("sender").toString());
        sender.setLastName("");
        sender.setFirstName("");
        messageDto.setSender(sender);

        JSONObject messageJson = new JSONObject(messageDto);
        TextMessage textMessage = new TextMessage(messageJson.toString());
        //TextMessage textMessage = new TextMessage(messageDto.toString());


        System.out.println("received");

        for ( WebSocketSession webSocketSession: sessions){
            webSocketSession.sendMessage(textMessage);//chatId content sender
            webSocketSession.sendMessage(message);
        }

    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        HashMap<String, WebSocketSession> map = new HashMap<>();
        map.put("test", session);
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception{
        super.afterConnectionClosed(session, status);
        HashMap<String, WebSocketSession> map = new HashMap<>();
        map.put("test", session);
        sessions.remove(session);
    }





}