import {Component, computed, inject} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AvatarService} from "../../services/avatar.service";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {

  userService = inject(UserService)

  firstName = ''
  lastName = ''
  password = ''

  clearForm() {
    this.firstName = ''
    this.lastName = ''
    this.password = ''
  }

  changeInfo() {
    this.userService.changeUserInfo({
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    })
    this.clearForm()
  }
}
