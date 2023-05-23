import {Component, computed, inject} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AvatarService} from "../../services/avatar.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {

  userService = inject(UserService)
  avatarService = inject(AvatarService)

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

  changeInfo() {
    // make request to change info
    this.userService.user.mutate(next => {
      if (this.username !== "") next.username = this.username
      if (this.firstName !== "") next.firstName = this.firstName
      if (this.lastName !== "") next.lastName = this.lastName
    })
    this.clearForm()
  }

  protected readonly computed = computed;
}
