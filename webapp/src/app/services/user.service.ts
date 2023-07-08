import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import IUser from "../models/user";
import {Router} from "@angular/router";
import {env as keycloak} from "../../environments/environment.keycloak";
import {env as server} from "../../environments/environment.backend";
import {ChatService} from "./chat.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private cookieService = inject(CookieService)
  private chatService = inject(ChatService)
  private router = inject(Router)

  public user = signal<IUser>({
    username: '',
    firstName: '',
    lastName: ''
  });

  #token = signal("")
  token = computed(() => this.#token())
  isLoggedIn = computed(() => this.token() !== "")

  public loginWarning = signal("")
  public registerWarning = signal("")
  public sessionWarning = signal(false)

  public queriedUsers = signal<IUser[]>([])

  constructor() {
    if (this.cookieService.check('token')) {
      console.log('Found Token in Cookies')
      this.changeToken(this.cookieService.get('token'))
    } else {
      this.cookieService.set('token', this.token())
    }

    effect(() => {
      if (!this.isLoggedIn()) {
        this.router.navigate(["/login"]).then(console.log)
      }
    })
  }


  logIn(username: string, password: string) {
    console.info("Making a LogIn Request")
    fetch(`http://localhost:${keycloak.port}/realms/${keycloak.realm}/protocol/openid-connect/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://localhost:4200',
      },
      cache: "no-cache",
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: keycloak.clientId,
        username: username,
        password: password
      })
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        if (Object.keys(data).includes("error")) {
          this.loginWarning.set("Username or Password are Invalid")
        } else {
          this.changeToken(data.access_token)
          this.router.navigate(["/profile"]).then(console.log)
        }
      })
      .catch(e => {
        console.error(e)
        this.loginWarning.set("Server is down :(")
      })
  }

  getUserInfo(token: string) {
    fetch(`http://localhost:${keycloak.port}/realms/${keycloak.realm}/protocol/openid-connect/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'http://localhost:4200',
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (Object.keys(data).includes("error")) {
          this.changeToken("")
        } else {
          const next: IUser = {
            username: data.preferred_username,
            firstName: data.given_name,
            lastName: data.family_name
          }
          this.user.set(next)
          this.chatService.init(next, this.token())
          this.searchUsers("");
        }
      })
      .catch(error => {
        console.error(error)
        this.changeToken("")
      });
  }

  registerUser(user: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    fetch(`http://localhost:${server.port}/create`, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJvdWJQWXBnbkZ4X0liWExrc2U3NGRmYzhuVWV4d0lubFd0MkQ4WjlLbjZJIn0.eyJleHAiOjE2ODcwNDIxMzgsImlhdCI6MTY4NzA0MTgzOCwianRpIjoiMjhmN2IwZjQtZjllZC00OTA4LTkyYzItZGQwM2EyNTNiYmY4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy90ZXN0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjViMmFlMGRiLWE5ODgtNDA3OS05MGRhLTVlYjdlYTczNmQzMCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNsaWVudCIsInNlc3Npb25fc3RhdGUiOiI1MTgyMzhiMS1hZmEyLTQ3MDctOWI1NC00MDU3NTZmNTIyYTgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMC8iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtdGVzdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzaWQiOiI1MTgyMzhiMS1hZmEyLTQ3MDctOWI1NC00MDU3NTZmNTIyYTgiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJpbGkgemhnaWxldmkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJpbGljaCIsImdpdmVuX25hbWUiOiJpbGkiLCJmYW1pbHlfbmFtZSI6InpoZ2lsZXZpIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIn0.bzo69usx9SP2UMNnjl-sKkVjngS7LNfcUKAvaKKZxo8OzQjROa9WAV5IF5gOynZkq9pHOrugKA-UgcJbgWOS47dPY4dUsv0z8mKwVlD_8XZ4dQgD09bwYSxIn2VdpFm_NjClnFdZPExHgOqWQVdM0ja_MVjGCzpyJhH8k-vDtz8n0MS6K0E1hBzjPFmeawKT3tH-S90xHxncePYs0IS84ETiqnyR8EA6Ydd_HPpRXiFx7NmY0XjP_CCXxuGZpe-vJpfxPD-ymuw3CstWiXe6_QiUnD-uuGSsgVmqjBv9KnSi5UwIJxGeaKFbvqh-sxJH8UoKgcnmlNBu3Hj93fcWEg'
      },
      body: JSON.stringify({
        ...user,
        email: "some@mail.cum"
      })
    }).then(res => {
      switch (res.status) {
        case 201:
          this.router.navigate(['login']).then(console.log);
          break;
        case 409:
          this.registerWarning.set("User already exists")
          break
        default:
          this.registerWarning.set("Something went Wrong")
      }
    })
    .catch(console.log);
  }

  changeUserInfo(info: {
    firstName: string,
    lastName: string,
    password: string
  }){
    fetch(`http://localhost:${server.port}/api/update`, {
      method: "POST",

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#token()}`
      },
      body: JSON.stringify({
        ...info
      })
    }).then(res => {
      switch (res.status) {
        case 204:
          this.user.update(prev => {
            return {
              ...prev,
              firstName: info.firstName === "" ? prev.firstName : info.firstName,
              lastName: info.lastName === "" ? prev.lastName : info.lastName,
            }
          })
          break;
        case 401:
          this.changeToken("")
      }
    })
      .catch(console.log)

  }

  searchUsers(query: string) {
    fetch(`http://localhost:${server.port}/api/users?` + new URLSearchParams({
      username: query
    }), {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${this.#token()}`
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        this.changeToken("")
        return
      })
      .then((data: IUser[]) => this.queriedUsers.set(data.filter(user => user.username !== this.user().username)))
      .catch(() => this.changeToken(""))
  }

  changeToken(token: string, raiseSessionExpiredMessageIfNeeded = true) {
    if (this.token() !== "" && token === "" && raiseSessionExpiredMessageIfNeeded) this.sessionWarning.set(true)
    console.log("Changing token to:", token)
    this.#token.set(token)
    this.cookieService.set('token', token)
    if (token !== "") {
      this.getUserInfo(token)
    } else {
      console.log("Switch to Null User")
      this.chatService.chats.set([])
      this.chatService.selected.set(undefined)
      this.chatService.webSocket?.unsubscribe()
      this.user.set({
        username: "",
        firstName: "",
        lastName: ""
      })
    }
  }

}
