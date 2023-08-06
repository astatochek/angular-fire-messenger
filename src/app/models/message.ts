import IUser from "./user";

export default interface IMessage {
  chatId: number
  messageId: number
  sender: IUser
  content: string
  date: Date
}
