import {ChangeDetectionStrategy, Component, computed, inject, Input, Signal} from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Chat, Message } from '../../../models/chat.interface';
import { AuthService } from '../../../services/auth.service';
import { MessengerUser } from '../../../models/user.interface';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  standalone: true,
  imports: [AvatarComponent, NgClass, DatePipe, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
  authService = inject(AuthService);
  user: Signal<MessengerUser | null | undefined> = computed(() =>
    this.authService.user(),
  );
  @Input() message: Message;
  @Input() chat: Chat | null | undefined;

  getDate() {
    return this.message.timestamp.toDate();
  }
}
