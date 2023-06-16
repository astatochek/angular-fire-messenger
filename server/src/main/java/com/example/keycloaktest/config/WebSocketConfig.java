package com.example.keycloaktest.config;

import com.example.keycloaktest.util.MyHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;


@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer{



    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new MyHandler(), "/ws")
                .setAllowedOrigins("*");



    }
}
