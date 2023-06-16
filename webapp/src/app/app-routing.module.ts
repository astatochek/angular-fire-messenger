import {computed, inject, NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ChatsComponent} from "./components/chats/chats.component";
import {SearchComponent} from "./components/search/search.component";
import {UserService} from "./services/user.service";
import {RegisterComponent} from "./components/register/register.component";

const PreAuthGuard = computed(() => {
  const userService = inject(UserService);
  if (userService.isLoggedIn()) {
    console.error('Preventing navigation to `/login` because user is already logged in')
  }
  return !userService.isLoggedIn()
})

const AuthGuard = computed(() => {
  const userService = inject(UserService);
  const router = inject(Router)
  if (!userService.isLoggedIn()) {
    console.error('Preventing navigation because user is NOT logged in')
    router.navigate(['login']).then(console.log)
  }
  return userService.isLoggedIn()
})

const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [PreAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PreAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/profile' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
