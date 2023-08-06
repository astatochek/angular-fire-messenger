import {Component, computed, inject} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router, RouterLink} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {TruncatePipe} from "../../pipes/truncate.pipe";
import {NgIf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [TruncatePipe, RouterLink, NgIf, TitleCasePipe]
})
export class NavbarComponent {

  userService = inject(UserService)
  chatService = inject(ChatService)
  router = inject(Router)

  isLoggedIn = computed(() => this.userService.isLoggedIn())
  username = computed(() => this.userService.user().username)
  interlocutor = computed(() => this.chatService.interlocutor())

}
