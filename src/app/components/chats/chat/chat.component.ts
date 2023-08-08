import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  Signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription, tap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { Chat } from '../../../models/chat.interface';
import { MessengerUser } from '../../../models/user.interface';
import { Message } from '../../../models/chat.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
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

  newMessageSubscription: Subscription;

  previousSelectedChat: string | null | undefined = undefined;

  senderIsAuthUser(message: Message) {
    const chat = this.chat();
    const user = this.user();
    if (!chat || !user) return false;
    return chat[message.sender].uid === user.uid;
  }

  ngOnInit() {
    this.previousSelectedChat = this.selected();
  }

  ngOnDestroy() {
    if (this.newMessageSubscription !== undefined) {
      this.newMessageSubscription.unsubscribe();
    }
  }

  @ViewChildren('messages') messages: QueryList<ElementRef>;
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('anchor') anchor: ElementRef;

  ngAfterViewInit() {
    const selectedMenuItem = document.getElementById(`${this.selected()}`);
    if (selectedMenuItem)
      selectedMenuItem.scrollIntoView({ behavior: 'smooth' });
    if (this.newMessageSubscription !== undefined) return;
    this.newMessageSubscription = this.messages.changes.subscribe(() => {
      if (this.previousSelectedChat !== this.selected()) {
        this.previousSelectedChat = this.selected();
        this.anchor.nativeElement.scrollIntoView();
      } else if (
        this.messages.last &&
        this.messages.last.nativeElement &&
        this.messages.length >= 2
      ) {
        const prev = this.messages.get(this.messages.length - 2);
        if (prev && prev.nativeElement) {
          const parentRect = this.wrapper.nativeElement.getBoundingClientRect();
          const childRect = prev.nativeElement.getBoundingClientRect();
          // console.log(childRect.top, parentRect.top, childRect.bottom, parentRect.bottom)
          if (
            childRect.top >= parentRect.top &&
            childRect.bottom <= parentRect.bottom + 50
          ) {
            // this.messages.last.nativeElement.scrollIntoView()
            this.anchor.nativeElement.scrollIntoView();
          }
        }
      }
    });
    setTimeout(() => this.anchor.nativeElement.scrollIntoView(), 0);
  }

  text: string = '';

  sendMessage() {
    if (this.text !== '') {
      this.chatService.sendMessage(this.text);
      this.anchor.nativeElement.scrollIntoView();
    }
    this.text = '';
  }

  constructor() {
    const idEmitter = toSignal(
      this.route.paramMap.pipe(
        tap((params: ParamMap) =>
          this.chatService.selectChat(params.get('id')!),
        ),
      ),
    );
  }
}
