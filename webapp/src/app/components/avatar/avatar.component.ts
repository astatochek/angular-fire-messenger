import {Component, effect, inject, Input, OnChanges, OnInit, signal} from '@angular/core';
import {AvatarService} from "../../services/avatar.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent implements OnInit, OnChanges {
  avatarService = inject(AvatarService)
  @Input("username") username = ""
  ngOnInit(): void {
    this.avatarService.set(this.username).then(() => {})
    // console.log('Requesting an avatar for', this.username)
  }

  ngOnChanges(): void {
    this.avatarService.set(this.username).then(() => {})
  }


}
