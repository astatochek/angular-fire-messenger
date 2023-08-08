import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { MessengerUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private authService = inject(AuthService);

  private user = computed(() => this.authService.user());

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

  private queriedUsers$ = this.authService.user$.pipe(
    distinctUntilChanged(),
    debounceTime(300),
    switchMap(() =>
      collectionData(
        query(
          this.usersCollectionRef,
          where('uid', '!=', this.user()?.uid ?? ''),
        ),
      ),
    ),
    map((users) =>
      (users as unknown as MessengerUser[]).filter(
        (user) =>
          user.email.includes(this.keyword()) ||
          user.firstName.toLowerCase().includes(this.keyword()) ||
          user.lastName.toLowerCase().includes(this.keyword()),
      ),
    ),
  );

  private queriedUsersSignalFromObservable = toSignal(this.queriedUsers$);

  public queriedUsers = computed(() => {
    const users = this.queriedUsersSignalFromObservable();
    if (!users) return [];
    return users;
  });
}
