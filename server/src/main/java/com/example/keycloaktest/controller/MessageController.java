package com.example.keycloaktest.controller;


import com.example.keycloaktest.dto.IdDto;
import com.example.keycloaktest.dto.UsernameDto;
import com.example.keycloaktest.service.ChatService;
import com.example.keycloaktest.util.UserList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.QueryParam;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/chat")
public class MessageController {

    @Autowired
    ChatService chatService;

    @PostMapping("/addchat")
    public void createChat(@RequestBody UserList userList){
    }

    @GetMapping("/chats")
    public ResponseEntity getChats(@RequestBody UsernameDto dto){
        ResponseEntity responseEntity = chatService.getChats(dto.getUsername());
        return responseEntity;
    }

    @GetMapping("/messages")
    public ResponseEntity getMessages(@RequestBody IdDto id){
        ResponseEntity responseEntity = chatService.allMessages(id.getId());
        return  responseEntity;
    }

}
