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

  isLoggedIn = computed(() => this.user().username !== "")

  constructor() {
    if (this.cookieService.check('user')) {
      this.user.set(JSON.parse(this.cookieService.get('user')))
    } else {
      this.cookieService.set('user', JSON.stringify(this.user()))
    }
  }

  private userChangeEffect = effect(() => {
    console.log('User Changed:', this.user())
    this.cookieService.set('user', JSON.stringify(this.user()))
    if (!this.isLoggedIn()) this.router.navigate(['/login']).then(r => console.log('Redirected:', r))
  })

  private justLoggedInEffect = effect(() => {
    if (this.isLoggedIn()) {
      this.router.navigate(['/profile']).then(r => console.log('Redirected:', r))
    }
  })
}
