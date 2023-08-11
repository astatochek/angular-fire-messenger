import { Component, computed, inject, Signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { async } from 'rxjs';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chat } from '../../models/chat.interface';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  imports: [MenuItemComponent, NgForOf, RouterOutlet, NgIf, AsyncPipe],
  standalone: true,
})
export class ChatsComponent {
  chatService = inject(ChatService);
  chats: Signal<Chat[] | null> = computed(() => this.chatService.chats());
}
