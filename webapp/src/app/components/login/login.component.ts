import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import * as _ from 'lodash';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

interface IForm {
  username: string
  password: string
}

interface IWarning {
  usernameWarning: string
  passwordWarning: string
  requestWarning: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent{
  userService = inject(UserService)
  router = inject(Router)

  form = signal<IForm>({username: '', password: ''})

  changeUsername(event: Event) {
    const username = (event.target as HTMLInputElement).value
    this.form.update(prev => {
      return {
        ...prev,
        username: username
      }
    })
  }

  changePassword(event: Event) {
    const password = (event.target as HTMLInputElement).value
    this.form.update(prev => {
      return {
        ...prev,
        password: password
      }
    })
  }

  clickLogin() {
    if (this.form().username === "" && this.form().password === "") {
      this.userService.loginWarning.set("Username and Password can't be empty")
      return
    }
    if (this.form().username === "") {
      this.userService.loginWarning.set("Username can't be empty")
      return
    }
    if (this.form().password === "") {
      this.userService.loginWarning.set("Password can't be empty")
      return
    }
    this.userService.loginWarning.update(() => "")
    this.userService.logIn(this.form().username, this.form().password)
  }

  clickClose() {
    console.log('Close Clicked')
    this.userService.loginWarning.set("")
  }

}
