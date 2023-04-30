import {Component, computed, inject} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  private userService = inject(UserService)
  private router = inject(Router)

  isLoggedIn = computed(() => this.userService.isLoggedIn())
  username = computed(() => this.userService.user().username)
  navigate(url: string): void {
    this.router.navigate([url]).then(r => console.log('Navigate Response:', r))
  }
}
