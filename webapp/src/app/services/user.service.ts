import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import IUser from "../models/user";
import {Router} from "@angular/router";
import {env} from "../../environments/environment.keycloak";
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
  public sessionWarning = signal(false)

  constructor() {
    if (this.cookieService.check('token')) {
      console.log('Found Token in Cookies')
      this.changeToken(this.cookieService.get('token'))
    } else {
      this.cookieService.set('token', this.token())
    }

    effect(() => {
      if (!this.isLoggedIn()) {
        this.router.navigate(["/login"]).then(() => {})
      }
    })
  }


  logIn(username: string, password: string) {
    console.info("Making a LogIn Request")
    fetch(`http://localhost:${env.port}/realms/${env.realm}/protocol/openid-connect/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://localhost:4200',
      },
      cache: "no-cache",
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: env.clientId,
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
          this.router.navigate(["/profile"]).then(() => {})
        }
      })
      .catch(e => {
        console.error(e)
        this.loginWarning.set("Server is down :(")
      })
  }

  getUserInfo(token: string) {
    fetch(`http://localhost:${env.port}/realms/${env.realm}/protocol/openid-connect/userinfo`, {
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
          this.chatService.init(next)
        }
      })
      .catch(error => {
        console.error(error)
        this.changeToken("")
      });
  }

  changeToken(token: string) {
    if (this.token() !== "" && token === "") this.sessionWarning.set(true)
    console.log("Changing token to:", token)
    this.#token.set(token)
    this.cookieService.set('token', token)
    if (token !== "") {
      this.getUserInfo(token)
    } else {
      console.log("Switch to Null User")
      this.user.set({
        username: "",
        firstName: "",
        lastName: ""
      })
    }
  }

}
