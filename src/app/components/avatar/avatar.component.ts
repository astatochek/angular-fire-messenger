import { Component, Input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {AvvvatarsComponent} from "@ngneat/avvvatars";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [NgClass, NgOptimizedImage, AvvvatarsComponent],
  standalone: true,
})
export class AvatarComponent {
  @Input('username') username = '';
  @Input('size') size: number = 64;
}
