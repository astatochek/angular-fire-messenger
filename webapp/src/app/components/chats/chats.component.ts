import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject, OnDestroy, OnInit,
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
export class ChatsComponent implements OnInit, AfterViewInit, OnDestroy {
  chatService = inject(ChatService)
  chat = computed(() => {
    const target = this.chatService.chats().filter(chat => chat.id === this.chatService.selected())
    if (target.length > 0) {
      return target[0]
    }
    return undefined
  })
  userService = inject(UserService)

  previousSelectedChat: number | undefined = undefined

  ngOnInit() {
    if (this.chatService.chats().length > 0) {
      this.chatService.selected.set(this.chatService.chats()[0].id)
    }
    this.previousSelectedChat = this.chatService.selected()
  }

  ngOnDestroy() {
    this.chatService.selected.set(undefined)
  }

  @ViewChildren('messages') messages: QueryList<ElementRef>
  @ViewChild('wrapper') wrapper: ElementRef
  @ViewChild('anchor') anchor: ElementRef


  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView()
    this.messages.changes.subscribe(() => {
      if (this.previousSelectedChat !== this.chatService.selected()) {
        this.previousSelectedChat = this.chatService.selected()
        this.anchor.nativeElement.scrollIntoView()
      }
      else if (this.messages.last && this.messages.last.nativeElement && this.messages.length >= 2) {
        const prev = this.messages.get(this.messages.length - 2)
        if (prev && prev.nativeElement) {
          const parentRect = this.wrapper.nativeElement.getBoundingClientRect();
          const childRect = prev.nativeElement.getBoundingClientRect();
          console.log(childRect.top, parentRect.top, childRect.bottom, parentRect.bottom)
          if (childRect.top >= parentRect.top && childRect.bottom <= parentRect.bottom + 50) {
            // this.messages.last.nativeElement.scrollIntoView()
            this.anchor.nativeElement.scrollIntoView()
          }
        }
      }
    })
  }

  text: string = ""

  sendMessage() {
    if (this.text !== "") {
      this.chatService.sendMessage(this.text)
      this.anchor.nativeElement.scrollIntoView()
    }
    this.text = ""
  }
}
