import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { NgIf, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [TruncatePipe, RouterLink, NgIf, TitleCasePipe, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  username = computed(() => this.authService.user()?.email ?? '...');
}
