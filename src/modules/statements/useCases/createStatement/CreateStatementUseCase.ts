import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, receiver_id }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw' || type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    if(type === 'transfer'){
        const statementSender = await this.statementsRepository.create({
          user_id,
          description,
          amount,
          type,
          sender_id: user_id,
        })
  
        
        await this.statementsRepository.create({
          user_id: receiver_id,
          description,
          amount,
          type,
          sender_id: statementSender.sender_id,
        })

        return statementSender;
  
      }

      const statementOperation = await this.statementsRepository.create({
        user_id,
        type,
        amount,
        description,
      });
  
      return statementOperation;
    }
  }

