package com.example.keycloaktest.controller;


import com.example.keycloaktest.dto.UserDto;
import com.example.keycloaktest.service.KeycloakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;



@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class SignUpController {

    @Autowired
    KeycloakService service;



    @PostMapping("/create")
    public ResponseEntity addUser(@RequestBody UserDto userDto) throws IOException, InterruptedException {
        int code = service.addUser(userDto);
        ResponseEntity responseEntity = ResponseEntity.status(code).build();
        return responseEntity;
    }
}
