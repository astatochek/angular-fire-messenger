package com.example.keycloaktest.util;

import ch.qos.logback.core.joran.ParamModelHandler;
import com.example.keycloaktest.dto.MessageDto;
import com.example.keycloaktest.dto.UserInfoDto;
import com.example.keycloaktest.entity.Chat;
import com.example.keycloaktest.repository.ChatRepository;
import com.example.keycloaktest.service.ChatService;
import com.google.gson.Gson;
import lombok.NoArgsConstructor;
import org.json.JSONObject;
import org.modelmapper.internal.util.CopyOnWriteLinkedHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;


@Component
public class MyHandler extends TextWebSocketHandler {

    private final ChatRepository chatRepository;

    public MyHandler(final ChatRepository chatRepository){
        this.chatRepository = chatRepository;
    }




    private List<Pair<String,WebSocketSession>> sessions = new CopyOnWriteArrayList<>();

//    private CopyOnWriteLinkedHashMap<String, WebSocketSession> sessions
//            = new CopyOnWriteLinkedHashMap<String, WebSocketSession>();



    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException, Exception {




        //Map<String, String> value = new Gson().fromJson(message.getPayload(), Map.class);
        JSONObject value = new JSONObject(message.getPayload());
        if (value.has("username")){
            String username = value.getString("username");
            for (Pair<String, WebSocketSession> i: sessions){
                if (i.getSecond().equals(session)){
                    i = Pair.of(username, session);
                }
            }

        }
        else {
            Chat chat = chatRepository.findById(Long.parseLong(value.get("chatId").toString())).get();

            String fPart = chat.getFParticipant();
            String sPart = chat.getSParticipant();
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
            SimpleDateFormat formatter = new SimpleDateFormat("EE MMM d y H:m:s ZZZ");
            messageJson.put("date", formatter.format(messageDto.getDate()));
            TextMessage textMessage = new TextMessage(messageJson.toString());
            //TextMessage textMessage = new TextMessage(messageDto.toString());



            System.out.println("received");
            super.handleTextMessage(session, message);

            for (Pair<String, WebSocketSession> webSocketSession : sessions) {
                if (messageJson.get("sender").equals(sPart) || messageJson.get("sender").equals(fPart)) {
                    webSocketSession.getSecond().sendMessage(textMessage);//chatId content sender
                }
            }
        }

    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        Pair<String, WebSocketSession> map = Pair.of("", session);
        sessions.add(map);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception{
        super.afterConnectionClosed(session, status);
        for (Pair<String, WebSocketSession> i: sessions){
            if (i.getSecond().equals(session)){
                sessions.remove(i);
            }
        }
        sessions.remove(session);
    }





}