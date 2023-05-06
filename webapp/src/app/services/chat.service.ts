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
  interlocutor = computed(() => {
    const id = this.selected()
    if (id === undefined) return undefined
    const idx = this.chats().map(chat => chat.id).indexOf(id)
    return this.chats()[idx].interlocutor
  })

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
    setInterval(() => {
      this.chats.mutate(next => {
        const selectedId = this.selected()
        if (selectedId !== undefined) {
          const chatIdx = next.map(chat => chat.id).indexOf(selectedId)
          next[chatIdx].messages.push(generateSampleMessages(next[chatIdx].id, next[chatIdx].interlocutor, this.userService.user(), 1)[0])
          console.log(next[chatIdx].messages[next[chatIdx].messages.length - 1])
        }
      })
    }, 2000)
  }

  selectChat(id: number) {
    if (this.chats().map(chat => chat.id).includes(id))
      this.selected.update(() => id);
  }

  sendMessage(text: string) {
    this.chats.mutate(next => {
      const selectedId = this.selected()
      if (selectedId !== undefined) {
        const message: IMessage = {
          chatId: selectedId,
          messageId: -1,
          sender: this.user(),
          content: text,
          date: new Date(Date.now())
        }
        const chatIdx = next.map(chat => chat.id).indexOf(selectedId)
        next[chatIdx].messages.push(message)
        console.log(message)
      }
    })
  }
}
