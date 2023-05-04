import {Component, inject, signal} from '@angular/core';
import {ChatService} from "../../services/chat.service";

// const delay = (delay: number) => {
//   return new Promise(resolve => setTimeout(resolve, delay));
// }

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
})
export class ChatsComponent {
  chatService = inject(ChatService)
  // isMouseOver = signal<number | undefined>(undefined)
  // isAnimatedToScroll = signal<number | undefined>(undefined)
  //
  // handleMouseOver(id: number | undefined) {
  //   this.isMouseOver.update(() => id)
  //   delay(500).then(() => {
  //     if (this.isMouseOver() === id) {
  //       this.isAnimatedToScroll.update(() => id)
  //     } else {
  //       this.isAnimatedToScroll.update(() => undefined)
  //     }
  //   })
  // }

}
