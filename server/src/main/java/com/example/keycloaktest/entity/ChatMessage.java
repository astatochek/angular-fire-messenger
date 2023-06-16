package com.example.keycloaktest.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Data
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private String sender;
    private String receiver;

    private Long chatId;

    public ChatMessage(String text, String sender, String receiver, Long chatId) {
        this.text = text;
        this.sender = sender;
        this.receiver = receiver;
        this.chatId = chatId;
    }
}