import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [NgClass, NgIf],
  standalone: true,
})
export class AvatarComponent {
  avatarService = inject(AvatarService);

  @Input('username') username = '';
  @Input('styles') styles: string[] = [];

  src = signal<string | undefined>(undefined);
}
