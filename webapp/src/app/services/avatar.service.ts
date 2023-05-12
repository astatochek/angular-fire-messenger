import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  repository = signal<Map<string, string>>(new Map())

  server = "http://127.0.0.1:8000"

  async set(username: string) {
    if (this.repository().has(username) || username === "") return
    const image = await fetch(`${this.server}/${username}`)
    const blob = await image.blob()
    const url = URL.createObjectURL(blob)
    this.repository().set(username, url)
  }


  constructor() { }
}
