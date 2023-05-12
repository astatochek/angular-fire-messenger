import {Component, inject, Input} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import IChat from "../../../models/chat";
import {AvatarService} from "../../../services/avatar.service";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html'
})
export class MenuItemComponent {

  chatService = inject(ChatService)
  avatarService = inject(AvatarService)

  @Input("chat") chat: IChat = {
    id: -1,
    interlocutor: {
      username: "",
      firstName: "",
      lastName: "",
    },
    messages: []
  }

}
