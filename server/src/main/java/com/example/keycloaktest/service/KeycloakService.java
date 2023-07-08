package com.example.keycloaktest.service;

import com.example.keycloaktest.dto.UserDto;
import com.example.keycloaktest.dto.UserInfoDto;
import com.example.keycloaktest.util.Credentials;
import com.nimbusds.jose.shaded.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import com.example.keycloaktest.config.KeycloakConfig;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

import static com.example.keycloaktest.config.KeycloakConfig.getInstances;


@Service
public class KeycloakService {


    public String getBody(UserDto userDto){
        String body = "{\"firstName\":\""+userDto.getFirstName()+"\","+
                "\"lastName\":\""+userDto.getLastName()+"\","+
                "\"enabled\":\"true\","+
                "\"email\":\""+"test@mail.com"+"\","+
                "\"username\":\""+userDto.getUsername()+"\"";
                if(!userDto.getPassword().isEmpty() && !userDto.getPassword().isBlank()){
                body+=",\"credentials\":[{\"type\":\"password\",\"value\":\""+userDto.getPassword()+"\"," +
                "\"temporary\": false}]}";}
                else{
                    body += "}";
                }

        return body;
    }



    public String getToken() throws InterruptedException, IOException {
        var client = HttpClient.newHttpClient();

        Map<String, String> params = new HashMap<>();
        String body = "client_id=admin-cli&grant_type=client_credentials&client_secret=86uqg7V3yIW9PuO55pHtVDl2ef3L8E8R";
        params.put("client_id", "admin-cli");
        params.put("grant_type", "client_credentials");
        params.put("client_secret", "86uqg7V3yIW9PuO55pHtVDl2ef3L8E8R");
        var request = HttpRequest.newBuilder(
                URI.create("http://localhost:8080/realms/master/protocol/openid-connect/token")
        ).headers("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body)).build();

        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String json = response.body();
        //System.out.println(json);
        JSONObject jsonParse = new JSONObject(json);
        //System.out.println(jsonParse.get("access_token").toString());
        return jsonParse.get("access_token").toString();
    }



    public int addUser(UserDto userDto) throws IOException, InterruptedException{
        var client = HttpClient.newHttpClient();
        String body = getBody(userDto);
        String token = getToken();
        var request = HttpRequest.newBuilder(
                URI.create("http://localhost:8080/admin/realms/test/users")
        ).headers("Content-Type", "application/json")
                .headers("Authorization", "Bearer "+token)
                .POST(HttpRequest.BodyPublishers.ofString(body)).build();

        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body().toString());
        System.out.println(response.statusCode());
        System.out.println(body);
        return response.statusCode();
    }

    public ResponseEntity<List<UserInfoDto>> getUsers(String username) throws IOException, InterruptedException{
        String token = getToken();
        String query = "";
        if (!username.isEmpty() && !username.isBlank()){
            query+="/?username="+username;
        }
        var client = HttpClient.newHttpClient();
        var request =  HttpRequest.newBuilder(
                URI.create("http://localhost:8080/admin/realms/test/users"+query)
        ).headers("Content-Type", "application/json")
                .headers("Authorization", "Bearer "+token).GET().build();

        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int code = response.statusCode();
        List<UserInfoDto> users = new ArrayList<>();
        if (code==200) {
            //JSONObject object = new JSONObject(response.body());
            JSONArray array = new JSONArray(response.body());


            for (int i = 0; i < array.length(); i++) {
                JSONObject object = array.getJSONObject(i);
                UserInfoDto infoDto = new UserInfoDto();
                //System.out.println(object.get("username").toString());
                //System.out.println(object.get("username").equals("admin") );
                if (!object.get("username").equals("admin")) {
                    infoDto.setUsername(object.get("username").toString());
                    infoDto.setFirstName(object.get("firstName").toString());
                    infoDto.setLastName(object.get("lastName").toString());
                    users.add(infoDto);
                }

            }
        }
        ResponseEntity<List<UserInfoDto>> responseEntity = ResponseEntity.status(code).body(users);
        return  responseEntity;
    }


    public JSONObject getInfo(String userToken) throws IOException, InterruptedException {
        String token = getToken();
        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder(
                URI.create("http://localhost:8080/realms/test/protocol/openid-connect/userinfo")
        ).headers("Authorization", userToken).POST(HttpRequest.BodyPublishers.noBody())
                .build();
        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject info = new JSONObject(response.body());
        System.out.println(info.toString());

        return info;
    }

    public ResponseEntity updateUser(String userToken, UserDto userDto) throws IOException, InterruptedException{
        JSONObject userInfo = getInfo(userToken);
        String token = getToken();
        String id = userInfo.get("sub").toString();
        String username = userInfo.get("preferred_username").toString();
        String fName = userInfo.get("given_name").toString();
        String lName = userInfo.get("family_name").toString();

        if (userDto.getFirstName().isBlank() || userDto.getFirstName().isEmpty()){
            userDto.setFirstName(fName);
        }
        if (userDto.getLastName().isBlank() || userDto.getLastName().isEmpty()){
            userDto.setLastName(lName);
        }

        String body = getBody(userDto);

        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder(
                URI.create("http://localhost:8080/admin/realms/test/users/"+id)
        ).headers("Authorization", "Bearer "+token).headers("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(body)).build();

        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        ResponseEntity responseEntity = ResponseEntity.status(response.statusCode()).build();
        return  responseEntity;
    }

}
