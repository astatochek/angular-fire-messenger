import {Component, computed, inject} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  userService = inject(UserService)
  chatService = inject(ChatService)
  router = inject(Router)

  isLoggedIn = computed(() => this.userService.isLoggedIn())
  username = computed(() => this.userService.user().username)
  interlocutor = computed(() => this.chatService.interlocutor())

}
