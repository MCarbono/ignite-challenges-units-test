import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    let parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
      sender_id
    }) => (
      {
        id,
        sender_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at,
      }
    ));

    parsedStatement.map((statement) => {
      if(statement.sender_id === null){
        delete statement.sender_id;
      }
    })

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
