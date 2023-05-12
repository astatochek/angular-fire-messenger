import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LoginComponent} from './components/login/login.component';
import {FormsModule} from "@angular/forms";
import {ProfileComponent} from './components/profile/profile.component';
import {NgOptimizedImage} from "@angular/common";
import {ChatsComponent} from './components/chats/chats.component';
import {TruncatePipe} from "./pipes/truncate.pipe";
import {MessageComponent} from './components/chats/message/message.component';
import { SearchComponent } from './components/search/search.component';
import { MenuItemComponent } from './components/chats/menu-item/menu-item.component';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ProfileComponent,
    ChatsComponent,
    TruncatePipe,
    MessageComponent,
    SearchComponent,
    MenuItemComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
