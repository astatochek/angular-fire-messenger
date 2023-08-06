import {Component, computed, inject, OnInit, signal} from '@angular/core';
import IUser from "../../models/user";
import {Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {UserService} from "../../services/user.service";
import {AvatarComponent} from "../avatar/avatar.component";
import {TruncatePipe} from "../../pipes/truncate.pipe";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [AvatarComponent, TruncatePipe, NgClass]
})
export class SearchComponent implements OnInit {
  ngOnInit(): void {
      if (this.userService.isLoggedIn()) this.userService.searchUsers("")
  }
  private router = inject(Router)
  private chatService = inject(ChatService)
  private userService = inject(UserService)

  keyword = signal("")
  users = computed(() => this.userService.queriedUsers())

  handleSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value
    this.keyword.update(() => val)
    this.userService.searchUsers(this.keyword())
  }

  async goToChat(interlocutor: IUser) {
    if (!this.chatService.chats().map(chat => chat.interlocutor.username).includes(interlocutor.username)) {
      await this.chatService.addChatWith(interlocutor)
    }
    this.chatService.selected.set(this.chatService.chats()[this.chatService.chats().map(chat => chat.interlocutor.username).indexOf(interlocutor.username)].id)
    this.router.navigate(['chats']).then(console.log)
  }

}
