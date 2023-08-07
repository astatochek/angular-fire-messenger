import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDoc,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { MessengerUser } from '../models/user.interface';

type UserCollectionDoc = MessengerUser;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private usersCollectionRef = collection(this.firestore, 'users');

  user: WritableSignal<UserCollectionDoc | null | undefined> =
    signal(undefined);
  private fireUser = toSignal(
    user(this.auth).pipe(
      tap((user) => {
        if (!user) this.user.update(() => null);
        else {
          getDoc(doc(this.usersCollectionRef, user.uid)).then((doc) => {
            this.user.update(() => doc.data() as unknown as UserCollectionDoc);
          });
        }
      }),
    ),
  );

  isLoggedIn = computed(() => {
    const user = this.fireUser();
    return user === undefined || !!user;
  });

  logInWithEmailAndPassword(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then()
      .catch(console.error);
  }

  logOut() {
    this.auth.signOut().then(() => this.navigateAfterLogOut());
  }

  registerWithEmailFullNameAndPassword(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCred) => {
        this.setUserInUsersCollection({
          uid: userCred.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: userCred.user.email!,
        });
      })
      .catch(console.error);
  }

  setUserInUsersCollection(user: UserCollectionDoc) {
    setDoc(doc(this.usersCollectionRef, user.uid), user).then();
  }

  navigateAfterLogIn() {
    this.router.navigate(['/profile']).then();
  }

  navigateAfterLogOut() {
    this.router.navigate(['/login']).then();
  }

  constructor() {
    effect(() => console.log('Logged In:', this.isLoggedIn()));
    effect(() => console.log('Logged In As:', this.user()));
    effect(() => {
      const user = this.user();
      if (
        user === null &&
        this.router.url !== '/login' &&
        this.router.url !== '/login'
      ) {
        this.navigateAfterLogOut();
      } else if (
        user !== undefined &&
        user !== null &&
        (this.router.url === '/login' || this.router.url === '/register')
      ) {
        this.navigateAfterLogIn();
      }
    });
  }
}
