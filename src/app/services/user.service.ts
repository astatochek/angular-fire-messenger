import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import IUser from '../models/user';
import { Router } from '@angular/router';

const keycloak = {
  realm: 'test',
  clientId: 'client',
  port: '8080',
};

const server = {
  port: '-1',
};
import { ChatService } from './chat.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authService = inject(AuthService);

  private cookieService = inject(CookieService);
  private chatService = inject(ChatService);

  public user = signal<IUser>({
    username: '',
    firstName: '',
    lastName: '',
  });

  #token = signal('');
  token = computed(() => this.#token());
  isLoggedIn = computed(() => this.token() !== '');

  public sessionWarning = signal(false);

  public queriedUsers = signal<IUser[]>([]);

  getUserInfo(token: string) {
    fetch(
      `http://localhost:${keycloak.port}/realms/${keycloak.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'http://localhost:4200',
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Object.keys(data).includes('error')) {
          this.changeToken('');
        } else {
          const next: IUser = {
            username: data.preferred_username,
            firstName: data.given_name,
            lastName: data.family_name,
          };
          this.user.set(next);
          this.chatService.init(next, this.token());
          this.searchUsers('');
        }
      })
      .catch((error) => {
        console.error(error);
        this.changeToken('');
      });
  }

  searchUsers(query: string) {
    fetch(
      `http://localhost:${server.port}/api/users?` +
        new URLSearchParams({
          username: query,
        }),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.#token()}`,
        },
      },
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        this.changeToken('');
        return;
      })
      .then((data: IUser[]) =>
        this.queriedUsers.set(
          data.filter((user) => user.username !== this.user().username),
        ),
      )
      .catch(() => this.changeToken(''));
  }

  changeToken(token: string, raiseSessionExpiredMessageIfNeeded = true) {
    if (
      this.token() !== '' &&
      token === '' &&
      raiseSessionExpiredMessageIfNeeded
    )
      this.sessionWarning.set(true);
    console.log('Changing token to:', token);
    this.#token.set(token);
    this.cookieService.set('token', token);
    if (token !== '') {
      this.getUserInfo(token);
    } else {
      console.log('Switch to Null User');
      this.chatService.chats.set([]);
      this.chatService.selected.set(undefined);
      this.chatService.webSocket?.unsubscribe();
      this.user.set({
        username: '',
        firstName: '',
        lastName: '',
      });
    }
  }
}
