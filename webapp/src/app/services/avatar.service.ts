import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  repository = signal<Map<string, string>>(new Map())

  get server() {
    return "http://127.0.0.1:8000"
  }

  active = true

  async set(username: string) {
    if (this.repository().has(username) || username === "" || !this.active) return
    try {
      const image = await fetch(`${this.server}/${username}`)
      const blob = await image.blob()
      const url = URL.createObjectURL(blob)
      this.repository().set(username, url)
    } catch (e) {
      this.active = false
    }
  }


  constructor() {
    setInterval(() => this.active = true, 600000)
  }
}
