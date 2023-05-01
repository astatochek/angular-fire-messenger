import {Component, computed, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserService} from "./services/user.service";
import IUser from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  userService = inject(UserService)

  constructor() {
    // setTimeout(() => {
    //   this.userService.user.set({
    //     username: '',
    //     firstName: '',
    //     lastName: ''
    //   })
    // }, 0)
    setTimeout(() => {
      this.userService.user.set({
        username: 'astatochek',
        firstName: 'Ostap',
        lastName: 'Korotchenok'
      })
    }, 0)
  }

}
