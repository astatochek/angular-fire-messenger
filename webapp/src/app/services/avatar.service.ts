import {Injectable} from '@angular/core';
import {env} from '../../environments/environment.avatars'

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private repo: Map<string, string | undefined> = new Map()

  async set(username: string) {
    if (!this.repo.has(username) || this.repo.get(username) === undefined) {
      this.repo.set(username, undefined)
      const image = await fetch(`${env.port}/${username}`)
      const blob = await image.blob()
      this.repo.set(username, URL.createObjectURL(blob))
    }
    return this.repo.get(username)
  }

}
