import {computed, inject, Injectable, signal} from '@angular/core';
import * as _ from "lodash";
import IChat from "../models/chat";
import {UserService} from "./user.service";
import IUser from "../models/user";
import IMessage from "../models/message";
import {users} from "../dummies/user.dummies";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  userService = inject(UserService)

  chats = signal<IChat[]>([])
  selected = signal<number | undefined>(undefined)

  private user = computed(() => this.userService.user())

  private users = users


  generateSampleMessages(chatId: number, participants: IUser[], n: number): IMessage[] {
    return Array(n).fill("").map((val, index) => {
      return {
        chatId: chatId,
        messageId: index,
        senderUsername: _.sample(participants)?.username || this.user().username,
        content: `${index}: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
      }
    })
  }

  constructor() {
    const numOfMessages = 10
    this.chats.mutate(next => {
      this.users.forEach((user, index) => {
        next.push({
          id: index,
          interlocutor: user,
          messages: this.generateSampleMessages(index, [user, this.user()], numOfMessages)
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
