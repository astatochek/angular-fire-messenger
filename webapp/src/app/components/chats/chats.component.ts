import {Component, inject, signal} from '@angular/core';
import {ChatService} from "../../services/chat.service";

// const delay = (delay: number) => {
//   return new Promise(resolve => setTimeout(resolve, delay));
// }

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
})
export class ChatsComponent {
  chatService = inject(ChatService)


}
