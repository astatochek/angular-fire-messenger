package com.example.keycloaktest.controller;


import com.example.keycloaktest.dto.IdDto;
import com.example.keycloaktest.dto.MessageDto;
import com.example.keycloaktest.dto.SendDto;
import com.example.keycloaktest.dto.UsernameDto;
import com.example.keycloaktest.service.ChatMessageService;
import com.example.keycloaktest.service.ChatService;
import com.example.keycloaktest.service.KeycloakService;
import com.example.keycloaktest.util.UserList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;
import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/chat")
public class MessageController {

    @Autowired
    ChatService chatService;

    @Autowired
    KeycloakService keycloakService;

    @Autowired
    ChatMessageService messageService;

    @PostMapping("/addchat")
    public ResponseEntity<Long> createChat(@RequestBody UserList userList){
        ResponseEntity<Long> responseEntity = chatService.addChat(userList);
        return responseEntity;
    }

    @GetMapping("/chats")
    public ResponseEntity getChats(@HeaderParam("Authorization") String token,
            @QueryParam("username") String username) throws IOException, InterruptedException {
//        if (!keycloakService.getInfo(token).get("sub").equals(username)){
//            return ResponseEntity.status(403).build();
//        }
        ResponseEntity responseEntity = chatService.getChats(username);
        return responseEntity;
    }

    @GetMapping("/messages")
    public ResponseEntity getMessages(@QueryParam("id") Long id){
        ResponseEntity responseEntity = chatService.allMessages(id);
        return  responseEntity;
    }

    @PostMapping("/send")
    public ResponseEntity processMessage(@RequestBody SendDto sendDto){

        messageService.save(sendDto);
        return ResponseEntity.ok().build();
    }

}
