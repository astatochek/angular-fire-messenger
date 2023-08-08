import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
})
export class WarningComponent {
  // userService = inject(UserService)
  // router = inject(Router)
  //
  // handleClick(route: string) {
  //   this.userService.sessionWarning.set(false)
  //   this.router.navigate([route]).then(() => {})
  // }
}
