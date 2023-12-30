import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';

import { AvatarComponent } from '../avatar/avatar.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import {AsyncPipe, CommonModule, NgClass, NgForOf, NgIf} from '@angular/common';

import { MessengerUser } from '../../models/user.interface';
import { SearchService } from '../../services/search.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [AvatarComponent, TruncatePipe, NgClass, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  private searchService = inject(SearchService);
  private chatService = inject(ChatService);

  keyword = this.searchService.keyword;

  onChanges(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchService.updateKeyword(val);
  }

  users: Signal<MessengerUser[]> = this.searchService.queriedUsers;

  goToChat(interlocutor: MessengerUser) {
    this.chatService.goToChatWith(interlocutor.uid);
  }
}
