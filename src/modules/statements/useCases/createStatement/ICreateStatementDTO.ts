import { Statement } from "../../entities/Statement";

/*export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' |
  'receiver_id'
>*/

interface ICreateStatementDTO {
  user_id: string
  description: string;
  amount: number;
  type: string;
  sender_id?: string;
  receiver_id?: string;
}

export { ICreateStatementDTO }