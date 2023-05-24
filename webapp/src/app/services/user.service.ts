import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import IUser from "../models/user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private cookieService = inject(CookieService)
  private router = inject(Router)

  public user = signal<IUser>({
    username: '',
    firstName: '',
    lastName: ''
  });

  #token = signal("")

  token = computed(() => this.#token())

  public loginWarning = signal("")

  isLoggedIn = computed(() => this.token() !== "")

  constructor() {
    if (this.cookieService.check('token')) {
      console.log('Found Token in Cookies')
      this.changeToken(this.cookieService.get('token'))
    } else {
      this.cookieService.set('token', this.token())
    }
  }


  private justLoggedInEffect = effect(() => {
    if (this.isLoggedIn()) {
      this.router.navigate(["/profile"]).then(() => {})
    } else {
      this.router.navigate(["/login"]).then(() => {})
    }
  })

  private realm = "realm"
  private clientId = "client"
  private port = "8080"

  logIn(username: string, password: string) {
    console.info("Making a LogIn Request")
    fetch(`http://localhost:${this.port}/realms/${this.realm}/protocol/openid-connect/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://localhost:4200',
      },
      cache: "no-cache",
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: this.clientId,
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
        }
      })
      .catch(e => {
        console.error(e)
        this.loginWarning.set("Server is down :(")
      })
  }

  getUserInfo(token: string) {
    fetch(`http://localhost:${this.port}/realms/${this.realm}/protocol/openid-connect/userinfo`, {
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
          this.user.set({
            username: data.preferred_username,
            firstName: data.given_name,
            lastName: data.family_name
          })
        }
      })
      .catch(error => {
        console.error(error)
        this.changeToken("")
      });
  }

  changeToken(token: string) {
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
