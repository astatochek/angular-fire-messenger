package com.example.keycloaktest.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private Long chatId;
    private UserInfoDto sender;
    private String content;
    private Long messageId;
    private Date date;
}
