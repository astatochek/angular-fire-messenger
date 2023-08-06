import {Component, computed, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserService} from "./services/user.service";
import IUser from "./models/user";
import {Router, NavigationStart} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  userService = inject(UserService)
  router = inject(Router)

  constructor() {  }

}
