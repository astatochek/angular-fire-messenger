import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';
import {AvatarService} from "../../services/avatar.service";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [
    NgClass,
    NgIf
  ],
  standalone: true
})
export class AvatarComponent implements OnInit, OnChanges {

  avatarService = inject(AvatarService)

  @Input("username") username = ""
  @Input("styles") styles: string[] = []

  src = signal<string | undefined>(undefined)

  ngOnInit(): void {
    this.set()
  }

  ngOnChanges(): void {
    this.set()
  }

  set(repeat = 2) {
    if (repeat === 0) return
    if (this.username === "") {
      setTimeout(() => {
        this.set(repeat - 1)
      }, 5000)
    } else {
      this.avatarService.set(this.username)
        .then(next => this.src.update(prev => (next === undefined) ? prev : next))
    }
  }

}
