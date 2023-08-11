import { Component, Input } from '@angular/core';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [NgClass, NgIf, NgOptimizedImage],
  standalone: true,
})
export class AvatarComponent {
  // avatarService = inject(AvatarService);

  @Input('username') username = '';
  @Input('styles') styles: string[] = [];

  // src = signal<string | undefined>(undefined);
}
