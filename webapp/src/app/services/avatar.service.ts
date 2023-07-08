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
      const image = await fetch(`http://localhost:${env.port}/${username}`, {
        mode: "cors",
        headers: {
          'Origin': 'http://localhost:4200',
        }
      })
      const blob = await image.blob()
      this.repo.set(username, URL.createObjectURL(blob))
    }
    return this.repo.get(username)
  }

}
