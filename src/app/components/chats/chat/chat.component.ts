import {
  AfterViewChecked,
  Component,
  computed,
  ElementRef,
  inject,
  Signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { Chat } from '../../../models/chat.interface';
import { MessengerUser } from '../../../models/user.interface';
import { Message } from '../../../models/chat.interface';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [],
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, MessageComponent, FormsModule],
})
export class ChatComponent implements AfterViewChecked {
  route = inject(ActivatedRoute);
  chatService = inject(ChatService);
  authService = inject(AuthService);

  selected: Signal<string | null | undefined> = computed(() =>
    this.chatService.selected(),
  );
  chat: Signal<Chat | null | undefined> = computed(() =>
    this.chatService.selectedChat(),
  );
  user: Signal<MessengerUser | null | undefined> = computed(() =>
    this.authService.user(),
  );

  senderIsAuthUser(message: Message) {
    const chat = this.chat();
    const user = this.user();
    if (!chat || !user) return false;
    return chat[message.sender].uid === user.uid;
  }

  @ViewChild('anchor') anchor: ElementRef;

  text: string = '';

  sendMessage() {
    if (this.text !== '') {
      this.chatService.sendMessage(this.text);
    }
    this.text = '';
  }

  ngAfterViewChecked() {
    this.anchor.nativeElement.scrollIntoView();
  }

  constructor() {
    this.route.paramMap
      .pipe(
        tap((params: ParamMap) =>
          this.chatService.selectChat(params.get('id')!),
        ),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  trackByMessage(index: number, message: Message): number {
    return message.timestamp.toMillis();
  }
}
