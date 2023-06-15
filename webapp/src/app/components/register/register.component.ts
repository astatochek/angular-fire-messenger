import {Component, inject, signal} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

interface IForm {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  userService = inject(UserService)
  router = inject(Router)

  form = signal<IForm>({username: '', firstName: '', lastName: '', password: ''})

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

  changeFirstName(event: Event) {
    const firstName = (event.target as HTMLInputElement).value
    this.form.update(prev => {
      return {
        ...prev,
        firstName: firstName
      }
    })
  }

  changeLastName(event: Event) {
    const lastName = (event.target as HTMLInputElement).value
    this.form.update(prev => {
      return {
        ...prev,
        lastName: lastName
      }
    })
  }

  clickRegister() {
    if (this.form().username === "" &&
        this.form().password === "" &&
        this.form().firstName === "" &&
        this.form().lastName === ""
    ) {
      this.userService.registerWarning.set("Form can't be empty")
      return
    }
    if (this.form().username === "") {
      this.userService.registerWarning.set("Username can't be empty")
      return
    }
    if (this.form().password === "") {
      this.userService.registerWarning.set("Password can't be empty")
      return
    }
    if (this.form().firstName === "") {
      this.userService.registerWarning.set("First Name can't be empty")
      return
    }
    if (this.form().lastName === "") {
      this.userService.registerWarning.set("Last Name can't be empty")
      return
    }
    this.userService.registerWarning.update(() => "")
    console.log("REGISTRATION REQUEST")
  }

  clickEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.clickRegister()
    }
  }

  clickClose() {
    console.log('Close Clicked')
    this.userService.registerWarning.set("")
  }

  navigateToLogin() {
    this.router.navigate(['login']).then(console.log)
  }

}
