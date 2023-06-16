package com.example.keycloaktest.service;

import com.example.keycloaktest.dto.ChatDto;
import com.example.keycloaktest.dto.MessageDto;
import com.example.keycloaktest.entity.Chat;
import com.example.keycloaktest.entity.ChatMessage;
import com.example.keycloaktest.repository.ChatMessageRepository;
import com.example.keycloaktest.repository.ChatRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;


    @Autowired
    private ChatMessageRepository messageRepository;


    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }


    public Map<String, Object> addChat(ArrayList<String> users){
        String fPart = users.get(0);
        String sPart = users.get(1);
        Chat chat = chatRepository.findByFParticipantOrSParticipant(fPart, sPart);
        Map<String, Object> response= new HashMap<>();
        response.put("code", 0);
        if (chat == null){
            Chat newChat = new Chat(fPart, sPart);
            chatRepository.save(newChat);
            response.put("chatId", newChat.getId());
        }
        else{
            response.put("chatId", chat.getId());
        }
        return response;

    }


    public ResponseEntity<List<ChatDto>> getChats(String username){
        List<Chat> chats = chatRepository.getChats(username);
        List<ChatDto> dtos = new ArrayList<>();
        Map<String, Object> response = new HashMap<>();
        response.put("data",new ArrayList<Object>());
        List<Object> tmp2 = new ArrayList<>();
        chats.forEach((chat)->{
            ChatDto dto = new ChatDto(chat.getId()
                    ,new String[]{chat.getFParticipant(), chat.getSParticipant()});
            dtos.add(dto);
        });

        ResponseEntity responseEntity = ResponseEntity.ok(dtos);

        return responseEntity;
    }

    public ResponseEntity<List<MessageDto>> allMessages(Long id){
        List<ChatMessage> messages = messageRepository.findByChatId(id);
        List<MessageDto> response = new ArrayList<>();
        messages.forEach((message) ->{
            MessageDto dto = new MessageDto(message.getChatId(), message.getSender(),
                    message.getText());
            response.add(dto);
        });

        ResponseEntity responseEntity = ResponseEntity.ok(response);
        return responseEntity;
    }



}