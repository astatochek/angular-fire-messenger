import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarComponent } from '../avatar/avatar.component';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [FormsModule, AvatarComponent, ReactiveFormsModule, NgClass],
})
export class ProfileComponent {
  private authService = inject(AuthService);
  user = computed(() => this.authService.user());

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl('', [Validators.minLength(6)]),
  });
  onClear() {
    this.profileForm.reset();
  }

  onSubmit() {
    this.authService.updateUserInfo(this.profileForm.value);
    this.onClear();
  }

  onLogOut() {
    this.authService.logOut();
  }
}
