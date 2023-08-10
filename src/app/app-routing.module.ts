import { computed, inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatsComponent } from './components/chats/chats.component';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { ChatComponent } from './components/chats/chat/chat.component';

const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const preAuthRoutes = ['/login', '/register'];
  if (authService.isLoggedIn()) {
    return true;
  } else {
    return preAuthRoutes.includes(state.url);
  }
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
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        component: ChatComponent,
        canActivate: [AuthGuard],
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
