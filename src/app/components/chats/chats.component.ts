import {ChangeDetectionStrategy, Component, computed, inject, Signal} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chat } from '../../models/chat.interface';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  imports: [MenuItemComponent, NgForOf, RouterOutlet, NgIf, AsyncPipe, NgClass],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent {
  chatService = inject(ChatService);
  chats: Signal<Chat[] | null> = computed(() => this.chatService.chats());
}
