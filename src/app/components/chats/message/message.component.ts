import {Component, inject, Input} from '@angular/core';
import IMessage from "../../../models/message";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent {

  @Input() message: IMessage = {
    chatId: -1,
    messageId: -1,
    sender: {
      username: '',
      firstName: '',
      lastName: ''
    },
    content: '',
    date: new Date()
  }

  userService = inject(UserService)
}
