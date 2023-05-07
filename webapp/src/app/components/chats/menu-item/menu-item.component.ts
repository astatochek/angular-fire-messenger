import {Component, inject, Input} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import IChat from "../../../models/chat";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html'
})
export class MenuItemComponent {

  chatService = inject(ChatService)

  @Input("chat") chat: IChat = {
    id: -1,
    interlocutor: {
      username: "",
      firstName: "",
      lastName: "",
      avatar: ""
    },
    messages: []
  }

}
