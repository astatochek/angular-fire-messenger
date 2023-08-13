import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatestWith, map, Observable } from 'rxjs';
import { MessengerUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private authService = inject(AuthService);

  private firestore = inject(Firestore);
  private usersCollectionRef = collection(this.firestore, 'users');

  public keyword = signal('');

  public updateKeyword(keyword: string) {
    this.keyword.update(() => keyword.toLowerCase());
  }

  private keyword$ = toObservable(this.keyword);

  public users$ = collectionData(this.usersCollectionRef) as Observable<
    MessengerUser[]
  >;

  private queriedUsers$ = this.users$.pipe(
    combineLatestWith(this.authService.user$, this.keyword$),
    map(([users, thisUser, keyword]) => {
      if (!thisUser) return [];
      return users.filter(
        (user) =>
          user.uid !== thisUser.uid &&
          (user.email.includes(keyword) ||
            user.firstName.toLowerCase().includes(keyword) ||
            user.lastName.toLowerCase().includes(keyword)),
      );
    }),
  );

  private queriedUsersSignalFromObservable = toSignal(this.queriedUsers$);

  public queriedUsers = computed(() => {
    const users = this.queriedUsersSignalFromObservable();
    if (!users) return [];
    return users;
  });
}
