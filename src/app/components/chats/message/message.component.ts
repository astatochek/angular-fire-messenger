import {Component, inject, Input} from '@angular/core';
import IMessage from "../../../models/message";
import {UserService} from "../../../services/user.service";
import {AvatarComponent} from "../../avatar/avatar.component";
import {DatePipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  standalone: true,
  imports: [AvatarComponent, NgClass, DatePipe]
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
