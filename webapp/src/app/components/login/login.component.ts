import {Component, computed, effect, inject, signal} from '@angular/core';
import * as _ from 'lodash';
import {UserService} from "../../services/user.service";

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
export class LoginComponent {
  userService = inject(UserService)

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

  warning = signal("")

  clickLogin() {
    if (this.form().username === "" && this.form().password === "") {
      this.warning.set("Username and Password can't be empty")
      return
    }
    if (this.form().username === "") {
      this.warning.set("Username can't be empty")
      return
    }
    if (this.form().password === "") {
      this.warning.set("Password can't be empty")
      return
    }
    this.warning.update(() => "")
    this.userService.logIn(this.form().username, this.form().password).then(res => {
      switch (res) {
        case 401:
          this.warning.set("Invalid username or password")
          break
        case 400:
          this.warning.set("Server is down :(")
          break
      }
    })
  }

  clickClose() {
    console.log('Close Clicked')
    this.warning.set("")
  }

}
