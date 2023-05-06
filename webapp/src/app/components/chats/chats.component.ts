import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject, OnInit,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {generateSampleMessages} from "../../dummies/message.dummies";
import {UserService} from "../../services/user.service";

const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
})
export class ChatsComponent implements OnInit, AfterViewInit {
  chatService = inject(ChatService)
  chat = computed(() => {
    const target = this.chatService.chats().filter(chat => chat.id === this.chatService.selected())
    if (target.length > 0) {
      return target[0]
    }
    return undefined
  })
  userService = inject(UserService)

  ngOnInit() {
    setInterval(() => {
      this.chatService.chats.mutate(next => {
        const selectedId = this.chatService.selected()
        if (selectedId !== undefined) {
          const chatIdx = next.map(chat => chat.id).indexOf(selectedId)
          next[chatIdx].messages.push(generateSampleMessages(next[chatIdx].id, next[chatIdx].interlocutor, this.userService.user(), 1)[0])
          console.log(next[chatIdx].messages[next[chatIdx].messages.length - 1])
        }
      })
    }, 2000)
  }

  @ViewChildren('messages') messages: QueryList<ElementRef>
  @ViewChild('wrapper') wrapper: ElementRef

  // TODO: add smooth enter animation for messages
  ngAfterViewInit() {
    if (this.messages.last && this.messages.last.nativeElement) {
      this.messages.last.nativeElement.scrollIntoView()
    }
    this.messages.changes.subscribe(() => {
      if (this.messages.last && this.messages.last.nativeElement && this.messages.length >= 2) {
        const prev = this.messages.get(this.messages.length - 2)
        if (prev && prev.nativeElement) {
          const parentRect = this.wrapper.nativeElement.getBoundingClientRect();
          const childRect = prev.nativeElement.getBoundingClientRect();
          if (childRect.top >= parentRect.top && childRect.bottom <= parentRect.bottom) {
            this.messages.last.nativeElement.scrollIntoView() // {behavior: "smooth", block: "end"}
          }
        }
      }
    })
  }
}
