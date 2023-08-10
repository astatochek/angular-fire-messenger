import { Component, computed, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
})
export class ChatsComponent {
  chatService = inject(ChatService);
  chats$ = this.chatService.chats$;
  // chats = computed(() => this.chatService.chats());
}
