import {Component, computed, inject} from '@angular/core';
import {UserService} from "../../services/user.service";
import {FormsModule} from "@angular/forms";
import {AvatarComponent} from "../avatar/avatar.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [FormsModule, AvatarComponent]
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
