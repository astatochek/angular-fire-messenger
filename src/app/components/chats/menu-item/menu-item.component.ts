import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  Signal,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import IChat from '../../../models/chat';
import { truncate } from 'lodash';
import { Chat } from '../../../models/chat.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessengerUser } from '../../../models/user.interface';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
})
export class MenuItemComponent implements OnChanges {
  router = inject(Router);
  chatService = inject(ChatService);
  authService = inject(AuthService);

  @Input('chatId') chatId = '';

  chat: WritableSignal<Chat | null | undefined> = signal<
    Chat | null | undefined
  >(null);

  interlocutor: Signal<MessengerUser | null> = computed(() => {
    const chat = this.chat();
    const user = this.authService.user();
    if (!chat || !user) return null;
    return chat.firstParticipant.uid === user.uid
      ? chat.secondParticipant
      : chat.firstParticipant;
  });

  selected: Signal<string | null | undefined> = computed(() =>
    this.chatService.selected(),
  );

  ngOnChanges() {
    this.chat.update(
      () =>
        this.chatService.chats()?.find((chat) => chat.id === this.chatId) ??
        null,
    );
  }
}
