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
  updatePassword,
  updateEmail,
  User,
} from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDoc,
  doc,
  setDoc,
  updateDoc,
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

  public user$ = user(this.auth);
  public user: WritableSignal<UserCollectionDoc | null | undefined> =
    signal(undefined);
  private fireUser = toSignal(
    this.user$.pipe(
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
    console.log('Trying to Log Out');
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

  updateUserInfo<
    T extends Partial<{
      firstName: string | null;
      lastName: string | null;
      password: string | null;
    }>,
  >(info: T) {
    let { firstName, lastName, password } = info;
    const user = this.user();
    if (!user) return;
    firstName = !firstName ? user.firstName : firstName;
    lastName = !lastName ? user.lastName : lastName;

    this.updateFirestoreUser(firstName, lastName).then(() => {
      if (password) {
        this.updatePassword(password).then();
      } else {
        getDoc(doc(this.usersCollectionRef, user.uid)).then((doc) => {
          this.user.update(() => doc.data() as unknown as UserCollectionDoc);
        });
      }
    });
  }

  private async updateFirestoreUser(firstName: string, lastName: string) {
    const user = this.user();
    if (!user) return;
    return updateDoc(doc(this.usersCollectionRef, user.uid), {
      ...user,
      firstName: firstName === '' ? user.firstName : firstName,
      lastName: lastName === '' ? user.lastName : lastName,
    }).catch(this.handleError);
  }

  private async updatePassword(password: string) {
    const user = this.fireUser();
    if (!user) return;
    return updatePassword(user, password).catch(this.handleError);
  }

  handleError(err: unknown) {
    console.error(err);
    this.logOut();
  }

  // private async updateEmail(email: string) {
  //   const user = this.fireUser();
  //   if (!user) return;
  //   return updateEmail(user, email);
  // }

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
