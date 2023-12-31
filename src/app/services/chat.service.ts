import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collectionData,
  collection,
  query,
  or,
  where,
  setDoc,
  doc,
  updateDoc,
  Timestamp,
  docData,
} from '@angular/fire/firestore';
import {
  combineLatestWith, debounceTime, distinctUntilChanged,
  distinctUntilKeyChanged,
  map, Observable,
  of,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chat, ChatDto, Message } from '../models/chat.interface';
import { AuthService } from './auth.service';
import { MessengerUser } from '../models/user.interface';
import {isEqual} from "lodash";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private router = inject(Router);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private usersCollectionRef = collection(this.firestore, 'users');

  private user$ = this.authService.user$;

  private user = computed(() => this.authService.user());

  private selectedChatId = new Subject<string | null>();

  public selectChat(id: string) {
    this.selectedChatId.next(id);
  }

  public unselectChat() {
    this.selectedChatId.next(null);
  }

  public selected = toSignal(this.selectedChatId.asObservable());

  private chatsCollectionRef = collection(this.firestore, 'chats');

  public chats$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) {
        this.chats.update(() => null);
        this.unselectChat();
        return of(null);
      }
      return of(user).pipe(
        combineLatestWith(
          collectionData(
            query(
              this.chatsCollectionRef,
              or(
                where('firstParticipant', '==', user.uid),
                where('secondParticipant', '==', user.uid),
              ),
            ),
          ),
        ),
        switchMap(([user, arr]: any) => {
          const chatDto = arr.map(
            (doc: any) =>
              ({
                id: doc.id,
                firstParticipant: doc.firstParticipant,
                secondParticipant: doc.secondParticipant,
                messages: doc.messages.length > 0 ? [doc.messages.pop()] : [],
              }) as ChatDto,
          );
          const uidList = chatDto.map((chat: any) => {
            if (chat.firstParticipant === user.uid)
              return chat.secondParticipant;
            return chat.firstParticipant;
          });
          uidList.push(user.uid);
          return zip(
            of(chatDto),
            collectionData(
              query(this.usersCollectionRef, where('uid', 'in', uidList)),
            ),
            of(user),
          );
        }),
        switchMap(([chats, users, user]) => {
          const usersRecord = users.reduce(
            (acc, user) => {
              acc[user.uid] = user;
              return acc;
            },
            {} as Record<string, MessengerUser>,
          );
          return zip(
            of(
              chats.map(
                (chat: any) =>
                  ({
                    ...chat,
                    firstParticipant: usersRecord[chat.firstParticipant],
                    secondParticipant: usersRecord[chat.secondParticipant],
                  }) as Chat,
              ),
            ),
            of(user),
          );
        }),
        distinctUntilChanged(isEqual),
        tap(([chats]) => {
          const prevChats = this.chats();
          if (!prevChats) this.chats.set(chats);
          else
            this.chats.update((prev) => {
              if (!prev) return;
              chats.forEach((chat: any) => {
                const prevIds = prev.map((chat) => chat.id);
                if (!prevIds.includes(chat.id)) prev.unshift(chat);
                else {
                  const index = prevIds.indexOf(chat.id);
                  if (prev[index].messages[0] !== chat.messages[0]) {
                    prev[index].messages[0] = chat.messages[0];
                  }
                }
              });
              return chats
            });
          // this.chats.set(chats);
        }),
      );
    }),
  );

  public selectedChat$ = this.selectedChatId.asObservable().pipe(
    combineLatestWith(this.user$),
    switchMap(([id, user]) => {
      if (!id || !user) return of(null);
      //@ts-ignore
      return (docData<ChatDto>(doc(this.firestore as any, 'chats', id)) as any as Observable<ChatDto>).pipe(
        distinctUntilKeyChanged('messages', (a, b) => a.length === b.length),
        switchMap((chat: ChatDto) => {
          const user = this.user()!;
          const uid =
            chat.firstParticipant === user.uid
              ? chat.secondParticipant
              : chat.firstParticipant;
          return zip(of(chat), docData(doc(this.usersCollectionRef, uid)));
        }),
        map(([chat, other]) => {
          const user = this.user()!;
          const firstParticipant: MessengerUser =
            chat.firstParticipant === user.uid
              ? (other as MessengerUser)
              : user;
          const secondParticipant: MessengerUser =
            chat.secondParticipant === user.uid
              ? (other as MessengerUser)
              : user;
          return {
            ...chat,
            firstParticipant: firstParticipant,
            secondParticipant: secondParticipant,
          } as Chat;
        }),
        tap((chat) => {
          const selectedChat = this.selectedChat();
          if (!selectedChat) this.selectedChat.set(chat);
          else if (chat.id !== selectedChat.id) this.selectedChat.set(chat);
          else if (chat.messages.length > selectedChat.messages.length) {
            const start = selectedChat.messages.length;
            this.selectedChat.update((prev) => {
              if (!prev) return prev;
              prev.messages.push(...chat.messages.slice(start));
              return prev
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
    const chat = this.chats()!.find(
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
    updateDoc(doc(this.firestore, 'chats', chat.id) as any, {
      messages: messages,
    })
      .then(console.log)
      .catch((err) => {
        console.error(err);
        this.authService.logOut();
      });
  }

  constructor() {
    toSignal(this.selectedChat$);
    toSignal(this.chats$);
  }
}
