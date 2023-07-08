package com.example.keycloaktest.config;

import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;

public class KeycloakConfig {

    static Keycloak keycloak = null;
    static String serverUrl = "http://localhost:8080/auth";
    static String realm = "Test";
    static String clientId = "client";
    static String clientSecret="X8DvT2G8oUKp3hosSmEwbTFYgF1VMyof";
    static String username = "admin";
    static String password = "admin";

    public KeycloakConfig(){}

    public static Keycloak getInstances(){
        if (keycloak==null){
            keycloak = KeycloakBuilder.builder()
                    .serverUrl(serverUrl)
                    .realm(realm)
                    .grantType(OAuth2Constants.PASSWORD)
                    .username(username)
                    .password(password)
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .resteasyClient(new ResteasyClientBuilder().connectionPoolSize(20).build())
                    .build();
        }
        return keycloak;
    }
}
