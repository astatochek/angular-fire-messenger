import { Timestamp } from '@angular/fire/firestore';
import { MessengerUser } from './user.interface';

export type Message = {
  sender: 'firstParticipant' | 'secondParticipant';
  timestamp: Timestamp;
  content: string;
};

type uid = string;

export type Chat = {
  id: string;
  firstParticipant: MessengerUser;
  secondParticipant: MessengerUser;
  messages: Message[];
};

type ParticipantsAsUID<T> = {
  [K in keyof T]: K extends `${string}Participant` ? uid : T[K];
};

export type ChatDto = ParticipantsAsUID<Chat>;
