import { Component, Input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [NgClass, NgOptimizedImage],
  standalone: true,
})
export class AvatarComponent {
  @Input('username') username = '';
  @Input('styles') styles: string[] = [];
}
