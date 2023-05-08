import {Component, computed, inject, signal} from '@angular/core';
import {users} from '../../dummies/user.dummies'
import IUser from "../../models/user";
import {Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  private router = inject(Router)
  private chatService = inject(ChatService)
  private userService = inject(UserService)

  keyword = signal("")
  users = computed(() => users.filter(user =>
    user.username !== this.userService.user().username && (
      this.keyword() === "" ||
      user.username.includes(this.keyword()) ||
      user.username.includes(this.keyword()) ||
      user.lastName.includes(this.keyword()))
  ))

  handleSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value
    this.keyword.update(() => val)
  }

  goToChat(interlocutor: IUser) {
    if (!this.chatService.chats().map(chat => chat.interlocutor.username).includes(interlocutor.username)) {
      this.chatService.addChatWith(interlocutor)
    }
    this.chatService.selected.set(this.chatService.chats()[this.chatService.chats().map(chat => chat.interlocutor.username).indexOf(interlocutor.username)].id)
    this.router.navigate(['chats']).then(r => console.log('Redirecting:', r))
  }

}
