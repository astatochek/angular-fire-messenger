import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  logInWithEmailAndPassword(email: string, password: string) {
    console.log(arguments);
  }

  constructor() {}
}
