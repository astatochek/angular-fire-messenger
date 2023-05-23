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

  public token = signal("")

  isLoggedIn = computed(() => this.user().username !== "")

  constructor() {
    if (this.cookieService.check('token')) {
      this.token.set(JSON.parse(this.cookieService.get('token')))
    } else {
      this.cookieService.set('token', JSON.stringify(this.token()))
      this.token.set("")
    }
  }

  tokenChangedEffect = effect(() => {
    if (this.token() != "") {
      this.getUserInfo()
    }
  })

  private userChangeEffect = effect(() => {
    if (!this.isLoggedIn()) this.router.navigate(['/login']).then(r => console.log('Prevented redirect:', r))
  })

  private justLoggedInEffect = effect(() => {
    if (this.isLoggedIn()) {
      this.router.navigate(['/profile']).then(r => console.log('Redirected:', r))
    }
  })

  private realm = "realm"
  private clientId = "client"
  private port = "8080"

  async logIn(username: string, password: string) {
    try {
      console.info("Making a LogIn Request")
      const response = await fetch(`http://localhost:${this.port}/realms/${this.realm}/protocol/openid-connect/token`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        cache: "no-cache",
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: this.clientId,
          username: username,
          password: password
        })
      })
      const data = await response.json()
      if (Object.keys(data).includes("error")) {
        return 401
      }
      this.token.set(data.access_token)
      return 200
    } catch (e) {
      console.error(e)
      return 400
    }
  }

  getUserInfo() {
    fetch(`http://localhost:${this.port}/realms/${this.realm}/protocol/openid-connect/userinfo`, {
      headers: {
        'Authorization': `Bearer ${this.token()}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.user.set({
          username: data.preferred_username,
          firstName: data.given_name,
          lastName: data.family_name
        })
      })
      .catch(error => console.error(error));
  }

}
