import {Component, inject, Input} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import IChat from "../../../models/chat";
import {truncate} from "lodash";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {

  chatService = inject(ChatService)

  @Input("chat") chat: IChat = {
    id: -1,
    interlocutor: {
      username: "",
      firstName: "",
      lastName: "",
    },
    messages: []
  }

  protected readonly truncate = truncate;
}
