import IUser from "./user";
import IMessage from "./message";

export default interface IChat {
  id: number
  interlocutor: IUser
  messages: IMessage[]
}
