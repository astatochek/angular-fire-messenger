import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface IForm {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onSubmit() {
    const { email, firstName, lastName, password } = this.registerForm.value;
    if (!email || !firstName || !lastName || !password) return;
    this.authService.registerWithEmailFullNameAndPassword(
      email,
      firstName,
      lastName,
      password,
    );
  }
}
