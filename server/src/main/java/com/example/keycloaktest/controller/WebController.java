package com.example.keycloaktest.controller;


import com.example.keycloaktest.dto.UserDto;
import com.example.keycloaktest.dto.UserInfoDto;
import com.example.keycloaktest.service.KeycloakService;
import com.example.keycloaktest.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.QueryParam;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/api")
public class WebController {

    @Autowired
    KeycloakService service;

    @GetMapping("/me")
    public Authentication index(){
        SecurityContext context = SecurityContextHolder.getContext();
        System.out.println(context.getAuthentication().getDetails());
        return context.getAuthentication();
    }

    @PostMapping("/create")
    public ResponseEntity addUser(@RequestBody UserDto userDto) throws IOException, InterruptedException {
        int code = service.addUser(userDto);
        ResponseEntity responseEntity = ResponseEntity.status(code).build();
        return responseEntity;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserInfoDto>> getUsers(@QueryParam("username") String username) throws  IOException, InterruptedException{
        if (username == null){
            username = "";
        }
        ResponseEntity<List<UserInfoDto>> response = service.getUsers(username);
        return response;
    }

    @PostMapping("/update")
    public ResponseEntity updateUser(@RequestHeader("Authorization") String token,
            @RequestBody UserDto userDto) throws IOException, InterruptedException {
        ResponseEntity response = service.updateUser(token, userDto);
        return response;
    }






}
