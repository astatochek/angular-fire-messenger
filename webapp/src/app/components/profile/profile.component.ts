import {Component, inject} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {

  userService = inject(UserService)

  username = ''
  firstName = ''
  lastName = ''
  password = ''

  clearForm() {
    this.username = ''
    this.firstName = ''
    this.lastName = ''
    this.password = ''
  }

}
