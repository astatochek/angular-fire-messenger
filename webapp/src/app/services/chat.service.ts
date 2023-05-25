import {computed, effect, inject, Injectable, signal} from '@angular/core';
import * as _ from "lodash";
import IChat from "../models/chat";
import IUser from "../models/user";
import IMessage from "../models/message";
import {users} from "../dummies/user.dummies";
import {generateSampleMessages} from "../dummies/message.dummies";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chats = signal<IChat[]>([])
  selected = signal<number | undefined>(undefined)
  interlocutor = computed(() => {
    const id = this.selected()
    if (id === undefined) return undefined
    const idx = this.chats().map(chat => chat.id).indexOf(id)
    return this.chats()[idx].interlocutor
  })

  private user: IUser

  private users: IUser[] = []

  init(user: IUser) {
    this.user = user
    if (this.chats().length === 0 && this.user.username !== '') {
      this.generateChatsWithMessages()
      console.log("Initialization Proceeded")
    } else {
      console.log("Initialization Rejected")
    }
  }

  private generateChatsWithMessages() {
    const numOfChats = 5
    for (let i = 0; i < numOfChats; i++) {
      let user = _.sample(users)
      while(user === undefined || this.users.includes(user))
        user = _.sample(users)
      this.users.push(user)
    }
    const numOfMessages = 10
    this.users.forEach((user, index) => {
      this.chats.mutate(next => {
        next.push({
          id: index,
          interlocutor: user,
          messages: []
        })
      })
      const messages = generateSampleMessages(index, user, this.user, numOfMessages)
      messages.forEach(message => {
        this.chats.mutate(next => {
          next[index].messages.push(message)
        })
      })
    })
  }

  constructor() {
    setInterval(() => {
      this.chats.mutate(next => {
        const selectedId = this.selected()
        if (selectedId !== undefined) {
          const chatIdx = next.map(chat => chat.id).indexOf(selectedId)
          next[chatIdx]
            .messages
            .push(generateSampleMessages(next[chatIdx].id, next[chatIdx].interlocutor, this.user, 1)[0])
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
          sender: this.user,
          content: text,
          date: new Date(Date.now())
        }
        const chatIdx = next.map(chat => chat.id).indexOf(selectedId)
        next[chatIdx].messages.push(message)
        // console.log(message)
      }
    })
  }

  addChatWith(interlocutor: IUser) {
    if (this.chats().map(chat => chat.interlocutor.username).includes(interlocutor.username)) {
      return
    }
    // handle a request to server
    // while not - this:
    this.chats.mutate(next => next.push({
      id: next.length + 1,
      interlocutor: interlocutor,
      messages: []
    }))
  }
}
