import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [],
})
export class ChatComponent {
  route = inject(ActivatedRoute);
  chatService = inject(ChatService);

  constructor() {
    const idEmitter = toSignal(
      this.route.paramMap.pipe(
        tap((params: ParamMap) =>
          this.chatService.selectChat(params.get('id')!),
        ),
      ),
    );
  }
}
