import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatsComponent } from './components/chats/chats.component';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { ChatComponent } from './components/chats/chat/chat.component';
import { ChatService } from './services/chat.service';

const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const preAuthRoutes = ['/login', '/register'];
  if (authService.isLoggedIn()) {
    return true;
  } else {
    return preAuthRoutes.includes(state.url);
  }
};

const ChatsGuard: CanActivateFn = (route, state) => {
  const chatService = inject(ChatService);
  const router = inject(Router);
  const selected = chatService.selected();
  if (selected && state.url === '/chats')
    router.navigate(['/chats', selected]).then();
  return true;
};

const ChatGuard: CanActivateFn = (route, state) => {
  const chatService = inject(ChatService);
  const router = inject(Router);
  const chats = chatService.chats();
  if (!chats) {
    router.navigate(['chats']).then();
  } else {
    const ids = chats.map((chat) => chat.id);
    const id = state.url.split('/').pop()!;
    if (!ids.includes(id)) {
      const selected = chatService.selected();
      if (!selected) router.navigate(['chats']).then();
      else router.navigate(['chats', selected]).then();
    }
  }
  return true;
};

const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chats',
    component: ChatsComponent,
    canActivate: [AuthGuard, ChatsGuard],
    children: [
      {
        path: ':id',
        component: ChatComponent,
        canActivate: [AuthGuard, ChatGuard],
      },
    ],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/profile' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
