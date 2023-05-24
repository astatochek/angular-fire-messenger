import {computed, inject, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ChatsComponent} from "./components/chats/chats.component";
import {SearchComponent} from "./components/search/search.component";
import {UserService} from "./services/user.service";
import {BlankComponent} from "./components/blank/blank.component";

const LoginGuard = computed(() => {
  const userService = inject(UserService);
  if (userService.isLoggedIn()) {
    console.error('Preventing navigation to `/login` because user is already logged in')
  }
  return !userService.isLoggedIn()
})

const AuthGuard = computed(() => {
  const userService = inject(UserService);
  if (!userService.isLoggedIn()) {
    console.error('Preventing navigation because user is NOT logged in')
  }
  return userService.isLoggedIn()
})

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
