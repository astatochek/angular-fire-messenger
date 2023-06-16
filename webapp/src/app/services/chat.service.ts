import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import * as _ from 'lodash'
import IChat from "../models/chat";
import IUser from "../models/user";
import IMessage from "../models/message";
import {Router} from "@angular/router";
import {env as server} from "../../environments/environment.backend";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  router = inject(Router)

  webSocket: WebSocketSubject<any> | undefined = undefined

  chats = signal<IChat[]>([])
  selected = signal<number | undefined>(undefined)
  interlocutor = computed(() => {
    const id = this.selected()
    if (id === undefined) return undefined
    const idx = this.chats().map(chat => chat.id).indexOf(id)
    return this.chats()[idx].interlocutor
  })

  private user: IUser
  private token: string

  init(user: IUser, token: string) {
    this.user = user
    this.token = token
    if (this.chats().length === 0 && this.user.username !== '') {
      this.fetchChats(user.username).then(() => {
        this.selected.set(this.chats().length > 0 ? this.chats()[0].id : undefined)
        this.webSocket = webSocket(`ws://localhost:${server.port}/ws`)
        this.webSocket.next({ username: user.username })
        this.webSocket.asObservable().subscribe(data => console.log('Message from WebSocket:', data))
      })
      console.log("Initialization Proceeded")
    } else {
      console.log("Initialization Rejected")
    }
  }

  async fetchChats(username: string) {
    const res = await fetch(`http://localhost:${server.port}/chat/chats?` + new URLSearchParams({
      username: username
    }), {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
    })
    switch (res.status) {
      case 403:
        // bruh :)
        break
      case 200:
        const chats: { chatId: number, participants: IUser[]}[] = await res.json()
        console.log(chats)
        this.chats.set(chats
          // .filter(item => item.participants.includes(username))
          .map(item => {
            const interlocutor = item.participants.filter(value => value.username !== username)[0]
            return {
              id: item.chatId,
              interlocutor: interlocutor,
              messages: []
            }
          })
        )
        this.chats().forEach(chat => {
          this.fetchMessages(chat.id).then(data => this.chats.mutate(prev => {
            prev[prev.map(chat => chat.id).indexOf(chat.id)].messages = data
          }))
        })
    }
  }

  constructor() {
    // setInterval(() => {
    //   if (this.user.username === "ilich") {
    //     this.selected.set(_.sample(this.chats().map(chat => chat.id)))
    //     this.sendMessage("Do you want to develop an app?")
    //   }
    // }, 1000)
    effect(() => console.log("Selected:", this.selected()))
    effect(() => console.log("Chats:", this.chats()))
  }

  selectChat(id: number) {
    if (this.chats().map(chat => chat.id).includes(id))
      this.selected.update(() => id);
  }

  sendMessage(text: string) {
    if (this.selected() === undefined) return
    fetch(`http://localhost:${server.port}/chat/send`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        chatId: this.selected(),
        sender: this.user.username,
        content: text
      })
    })
      .then(console.log)
    // this.webSocket?.next({
    //   sender: this.user.username,
    //   chatId: this.selected()
    // })
  }

  async addChatWith(interlocutor: IUser) {
    if (this.chats().map(chat => chat.interlocutor.username).includes(interlocutor.username)) {
      return
    }
    const res = await fetch(`http://localhost:${server.port}/chat/addchat`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        users: [interlocutor.username, this.user.username]
      })
    })
    const id = await res.json()
    this.chats.mutate(next => next.push({
      id: id,
      interlocutor: interlocutor,
      messages: []
    }))
  }

  async fetchMessages(id: number): Promise<IMessage[]> {
    const res = await fetch(`http://localhost:${server.port}/chat/messages?` + new URLSearchParams({
      id: `${id}`
    }), {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    return await res.json()
  }

}
