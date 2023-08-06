import { computed, effect, inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { collection, Firestore, addDoc } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

type UserCollectionDoc = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  usersCollectionRef = collection(this.firestore, 'users');

  user = toSignal(user(this.auth));

  isLoggedIn = computed(() => {
    const user = this.user();
    return user === undefined || !!user;
  });

  logInWithEmailAndPassword(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(console.warn)
      .catch(console.error);
  }

  logOut() {
    this.auth.signOut().then();
  }

  registerWithEmailFullNameAndPassword(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCred) => {
        this.addUserToUsersCollection({
          uid: userCred.user.uid,
          firstName: firstName,
          lastName: lastName,
          email: userCred.user.email!,
        });
      })
      .catch(console.error);
  }

  addUserToUsersCollection(doc: UserCollectionDoc) {
    addDoc(this.usersCollectionRef, doc).then();
  }

  constructor() {
    effect(() => console.log('Logged In:', this.isLoggedIn()));
  }
}
