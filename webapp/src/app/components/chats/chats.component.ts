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
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";
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

  newMessageSubscription: Subscription

  previousSelectedChat: number | undefined = undefined

  ngOnInit() {
    this.previousSelectedChat = this.chatService.selected()
  }

  ngOnDestroy() {
    if (this.newMessageSubscription !== undefined) {
      this.newMessageSubscription.unsubscribe()
    }
  }


  @ViewChildren('messages') messages: QueryList<ElementRef>
  @ViewChild('wrapper') wrapper: ElementRef
  @ViewChild('anchor') anchor: ElementRef


  ngAfterViewInit() {
    const selectedMenuItem = document.getElementById(`${this.chatService.selected()}`)
    if (selectedMenuItem) selectedMenuItem.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => {
      if (this.newMessageSubscription !== undefined) return
      this.newMessageSubscription = this.messages.changes.subscribe(() => {
        if (this.previousSelectedChat !== this.chatService.selected()) {
          this.previousSelectedChat = this.chatService.selected()
          this.anchor.nativeElement.scrollIntoView()
        }
        else if (this.messages.last && this.messages.last.nativeElement && this.messages.length >= 2) {
          const prev = this.messages.get(this.messages.length - 2)
          if (prev && prev.nativeElement) {
            const parentRect = this.wrapper.nativeElement.getBoundingClientRect();
            const childRect = prev.nativeElement.getBoundingClientRect();
            // console.log(childRect.top, parentRect.top, childRect.bottom, parentRect.bottom)
            if (childRect.top >= parentRect.top && childRect.bottom <= parentRect.bottom + 50) {
              // this.messages.last.nativeElement.scrollIntoView()
              this.anchor.nativeElement.scrollIntoView()
            }
          }
        }
      })
    }, 1000)
    setTimeout(() => this.anchor.nativeElement.scrollIntoView(), 0)
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
