package com.example.keycloaktest.util;


import com.example.keycloaktest.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserContext {
    private String token;
    private UserDto userDto;
}
