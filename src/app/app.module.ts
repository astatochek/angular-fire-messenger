import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgOptimizedImage} from "@angular/common";
import {ChatsComponent} from './components/chats/chats.component';
import { MenuItemComponent } from './components/chats/menu-item/menu-item.component';
import { WarningComponent } from './components/warning/warning.component';
import { RegisterComponent } from './components/register/register.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {MessageComponent} from "./components/chats/message/message.component";
import {FormsModule} from "@angular/forms";
import {AvatarComponent} from "./components/avatar/avatar.component";
import {TruncatePipe} from "./pipes/truncate.pipe";
import {NavbarComponent} from "./components/navbar/navbar.component";

@NgModule({
  declarations: [
    AppComponent,
    ChatsComponent,
    MenuItemComponent,
    WarningComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MessageComponent,
    FormsModule,
    AvatarComponent,
    TruncatePipe,
    NavbarComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
