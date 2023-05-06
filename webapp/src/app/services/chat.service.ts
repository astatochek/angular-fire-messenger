import {computed, inject, Injectable, signal} from '@angular/core';
import * as _ from "lodash";
import IChat from "../models/chat";
import {UserService} from "./user.service";
import IUser from "../models/user";
import IMessage from "../models/message";
import {users} from "../dummies/user.dummies";
import {generateSampleMessages} from "../dummies/message.dummies";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  userService = inject(UserService)

  chats = signal<IChat[]>([])
  selected = signal<number | undefined>(undefined)

  private user = computed(() => this.userService.user())

  private users = users




  constructor() {
    const numOfMessages = 10
    this.chats.mutate(next => {
      this.users.forEach((user, index) => {
        next.push({
          id: index,
          interlocutor: user,
          messages: generateSampleMessages(index, user, this.user(), numOfMessages)
        })
      })
    })
    if (this.chats().length > 0) {
      this.selected.set(this.chats()[0].id)
    }

  }

  selectChat(id: number) {
    if (this.chats().map(chat => chat.id).includes(id))
      this.selected.update(() => id);
  }
}
