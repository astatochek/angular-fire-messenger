import { LoremIpsum } from "lorem-ipsum";
import IUser from "../models/user";
import IMessage from "../models/message";
import * as _ from "lodash";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

function getMessageContent(num: number) {
  return lorem.generateSentences(num)
}

export function generateSampleMessages(chatId: number, interlocutor: IUser, user: IUser, n: number): IMessage[] {
  const participants = [interlocutor, user]
  return Array(n).fill("").map((val, index) => {
    return {
      chatId: chatId,
      messageId: index,
      senderUsername: _.sample(participants)?.username || user.username,
      content: getMessageContent(Math.floor(Math.random() * 2) + 1)
    }
  })
}

// lorem.generateWords(1);
// lorem.generateSentences(5);
// lorem.generateParagraphs(7);
