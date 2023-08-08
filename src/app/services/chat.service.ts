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
} from '@angular/fire/firestore';
import {
  combineLatest,
  combineLatestWith,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chat, ChatDto } from '../models/chat.interface';
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

  private users$ = this.searchService.users$;
  private user$ = this.authService.user$;

  private user = computed(() => this.authService.user());

  private selectedChatId = new Subject<string | null>();

  public selectChat(id: string) {
    this.selectedChatId.next(id);
  }

  public selected = toSignal(this.selectedChatId.asObservable());

  private chatsCollectionRef = collection(this.firestore, 'chats');

  private chats$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
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
          console.log(chats);
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

  private selectedChat$ = this.selectedChatId.asObservable().pipe(
    combineLatestWith(this.chats$),
    map(([id, chats]) => {
      if (!id || !chats) return null;
      return chats.find((chat) => chat.id === id) ?? null;
    }),
  );

  public chats = toSignal(this.chats$);
  public selectedChat = toSignal(this.selectedChat$);

  public goToChatWith(uid: string) {
    const user = this.user();
    if (!user) return;
    const chat = this.chats()?.find(
      (chat) =>
        chat.firstParticipant.uid === uid || chat.secondParticipant.uid === uid,
    );
    if (!chat) {
      addDoc(this.chatsCollectionRef, {
        id: user.uid + uid,
        firstParticipant: user.uid,
        secondParticipant: uid,
        messages: [],
      } as ChatDto)
        .then((doc) => {
          const id = doc.id;
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

  constructor() {
    effect(() => console.log('Selected Chat:', this.selectedChat()));
  }
}
