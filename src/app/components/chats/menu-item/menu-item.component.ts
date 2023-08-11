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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessengerUser } from '../../../models/user.interface';
import { NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { AvatarComponent } from '../../avatar/avatar.component';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  imports: [
    RouterLink,
    NgClass,
    AvatarComponent,
    TitleCasePipe,
    TruncatePipe,
    NgIf,
  ],
  standalone: true,
})
export class MenuItemComponent {
  router = inject(Router);
  chatService = inject(ChatService);
  authService = inject(AuthService);

  @Input('chat') chat!: Chat;

  getOtherUser() {
    const user = this.authService.user();
    if (!user) return;
    if (this.chat.firstParticipant.uid === user.uid)
      return this.chat.secondParticipant;
    return this.chat.firstParticipant;
  }

  selected: Signal<string | null | undefined> = computed(() =>
    this.chatService.selected(),
  );
}
