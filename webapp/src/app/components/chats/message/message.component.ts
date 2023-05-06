import {Component, inject, Input} from '@angular/core';
import IMessage from "../../../models/message";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent {

  @Input() message: IMessage | null = null

  userService = inject(UserService)
}
