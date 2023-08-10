import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ParamMap, Router } from '@angular/router';
import {
  Firestore,
  collectionData,
  collection,
  getDoc,
  query,
  or,
  where,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  docData,
} from '@angular/fire/firestore';
import {
  combineLatest,
  combineLatestAll,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  from,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Chat, ChatDto, Message } from '../models/chat.interface';
import { AuthService } from './auth.service';
import { MessengerUser } from '../models/user.interface';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private router = inject(Router);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private searchService = inject(SearchService);

  private usersCollectionRef = collection(this.firestore, 'users');

  private users$ = this.searchService.users$;
  private user$ = this.authService.user$;

  private user = computed(() => this.authService.user());

  private selectedChatId = new Subject<string | null>();

  public selectChat(id: string) {
    this.selectedChatId.next(id);
  }

  public selected$ = this.selectedChatId.asObservable();

  public selected = toSignal(this.selectedChatId.asObservable());

  private chatsCollectionRef = collection(this.firestore, 'chats');

  public chats$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) {
        this.chats.update(() => null);
        return of(null);
      }
      return collectionData(
        query(
          this.chatsCollectionRef,
          or(
            where('firstParticipant', '==', user.uid),
            where('secondParticipant', '==', user.uid),
          ),
        ),
      ).pipe(
        map((arr) =>
          arr.map(
            (doc) =>
              ({
                id: doc.id,
                firstParticipant: doc.firstParticipant,
                secondParticipant: doc.secondParticipant,
                messages: doc.messages,
              }) as ChatDto,
          ),
        ),
        combineLatestWith(this.users$),
        map(([chats, users]) => {
          const usersRecord = users.reduce(
            (acc, user) => {
              acc[user.uid] = user;
              return acc;
            },
            {} as Record<string, MessengerUser>,
          );
          // console.log(chats);
          // console.log(usersRecord);
          return chats.map(
            (chat) =>
              ({
                ...chat,
                firstParticipant: usersRecord[chat.firstParticipant],
                secondParticipant: usersRecord[chat.secondParticipant],
              }) as Chat,
          );
        }),
      );
    }),
  );

  public selectedChat$ = this.selectedChatId.asObservable().pipe(
    combineLatestWith(this.user$),
    switchMap(([id, user]) => {
      if (!id || !user) return of(null);
      return docData(doc(this.firestore, 'chats', id)).pipe(
        tap((data) => console.log('Tap On:', data)),
        distinctUntilKeyChanged('messages', (a, b) => a.length === b.length),
        map((chat) => chat as unknown as ChatDto),
        switchMap((chat) => {
          const user = this.user()!;
          const uid =
            chat.firstParticipant === user.uid
              ? chat.secondParticipant
              : chat.firstParticipant;
          return zip(of(chat), docData(doc(this.usersCollectionRef, uid)));
        }),
        map(
          ([chat, other]) =>
            ({
              ...chat,
              firstParticipant: this.user()!,
              secondParticipant: other as unknown as MessengerUser,
            }) as Chat,
        ),
        tap((chat) => {
          const selectedChat = this.selectedChat();
          if (!selectedChat) this.selectedChat.set(chat);
          else if (chat.id !== selectedChat.id) this.selectedChat.set(chat);
          else if (chat.messages.length > selectedChat.messages.length) {
            const start = selectedChat.messages.length;
            this.selectedChat.mutate((prev) => {
              if (!prev) return;
              prev.messages.push(...chat.messages.slice(start));
            });
          }
        }),
      );
    }),
  );

  public chats = signal<Chat[] | null>(null);
  public selectedChat = signal<Chat | null>(null);

  public goToChatWith(uid: string) {
    const user = this.user();
    if (!user) return;
    const chat = this.chats()?.find(
      (chat) =>
        chat.firstParticipant.uid === uid || chat.secondParticipant.uid === uid,
    );
    if (!chat) {
      setDoc(doc(this.firestore, 'chats', user.uid + uid), {
        id: user.uid + uid,
        firstParticipant: user.uid,
        secondParticipant: uid,
        messages: [],
      } as ChatDto)
        .then(() => {
          this.router.navigate(['chats', user.uid + uid]).then();
        })
        .catch((err) => {
          console.error(err);
          this.authService.logOut();
        });
    } else {
      this.router.navigate(['chats', chat.id]).then();
    }
  }

  sendMessage(text: string) {
    const user = this.user();
    const chat = this.selectedChat();
    if (!user || !chat) return;
    const message: Message = {
      content: text,
      sender:
        user.uid === chat.firstParticipant.uid
          ? 'firstParticipant'
          : 'secondParticipant',
      timestamp: Timestamp.now(),
    };
    const messages = chat.messages;
    messages.push(message);
    updateDoc(doc(this.firestore, 'chats', chat.id), {
      messages: messages,
    })
      .then(console.log)
      .catch((err) => {
        console.error(err);
        this.authService.logOut();
      });
  }

  constructor() {
    // effect(() => console.log('Selected Chat:', this.selectedChat()));
    // this.selectedChat$.subscribe((data) => console.log('This Chat:', data));
    const selectedChatSignal = toSignal(this.selectedChat$);
  }
}
