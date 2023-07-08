package com.example.keycloaktest.repository;


import com.example.keycloaktest.entity.ChatMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    public List<ChatMessage> findByChatId(Long id);


}