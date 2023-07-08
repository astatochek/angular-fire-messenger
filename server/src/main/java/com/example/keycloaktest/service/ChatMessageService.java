package com.example.keycloaktest.service;

import com.example.keycloaktest.dto.MessageDto;
import com.example.keycloaktest.dto.SendDto;
import com.example.keycloaktest.entity.Chat;
import com.example.keycloaktest.entity.ChatMessage;
import com.example.keycloaktest.repository.ChatMessageRepository;
import com.example.keycloaktest.repository.ChatRepository;
import java.util.Map;

import org.hibernate.engine.spi.Resolution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Transactional
@Service
public class ChatMessageService {

    @Autowired
    ChatMessageRepository messageRepository;


    @Autowired
    ChatRepository chatRepository;


    public ChatMessageService(ChatMessageRepository messageRepository,
                              ChatRepository chatRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
    }



    public ResponseEntity getAllMessages(Long chatId){

        List<ChatMessage>  allMessages = messageRepository.findByChatId(chatId);
        ResponseEntity responseEntity = ResponseEntity.ok(allMessages);
        return responseEntity;
    }

    public ResponseEntity  proccessMessage(MessageDto messageDto){

        String senderUsername = messageDto.getSender().getUsername();
        String fParticipant = chatRepository.findById(messageDto.getChatId()).get().getFParticipant();
        String sParticipant = chatRepository.findById(messageDto.getChatId()).get().getSParticipant();
        String receiverUsername;
        if(senderUsername == fParticipant){
            receiverUsername = sParticipant;
        }
        else{
            receiverUsername = fParticipant;
        }
        ChatMessage message = new ChatMessage(messageDto.getContent(), senderUsername, receiverUsername,
                messageDto.getChatId());
        messageRepository.save(message);

        ResponseEntity responseEntity = ResponseEntity.ok(message);
        return responseEntity;
    }

    public void save(SendDto messageDto){
        Long chatId = messageDto.getChatId();
        String sender = messageDto.getSender();
        Chat chat = chatRepository.findById(messageDto.getChatId()).get();
        String receiver;
        if (chat.getSParticipant() == sender){
            receiver = chat.getFParticipant();
        }
        else{
            receiver = chat.getFParticipant();
        }

        ChatMessage newMessage = new ChatMessage(messageDto.getContent(),sender,receiver,chatId);
        messageRepository.save(newMessage);

    }
}