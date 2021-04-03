import { CreateStatementError } from './CreateStatementError'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';

import { CreateStatementUseCase } from './CreateStatementUseCase'
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
    beforeEach(() => {
      inMemoryStatementsRepository = new InMemoryStatementsRepository();
      inMemoryUsersRepository = new InMemoryUsersRepository();

      createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to create a deposit", async () => {
      const user = {
        name: "Teste",
        email: "teste@gmail.com",
        password: "12345"
      }

      const userCreated = await createUserUseCase.execute(user);

      const { id } = userCreated;

      await createStatementUseCase.execute({
        user_id: String(id),
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "freela"
      })

      expect(201)
    })

    it("Should be able to create a withdraw", async () => {
      const user = {
        name: "Teste",
        email: "teste@gmail.com",
        password: "12345"
      }

      const userCreated = await createUserUseCase.execute(user);

      const { id } = userCreated;

      await createStatementUseCase.execute({
        user_id: String(id),
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "deposito teste"
      })

      await createStatementUseCase.execute({
        user_id: String(id),
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "saque de teste"
      })

      expect(201)
    })

    it("Should not be able to create a statement with a unexistent user", () => {
      expect(async () => {
        const user = {
          name: "Teste",
          email: "teste@gmail.com",
          password: "12345"
        }

        await createUserUseCase.execute(user);

        await createStatementUseCase.execute({
          user_id: "dsdsa13-32131232-fdfdfd-54656565",
          type: OperationType.DEPOSIT,
          amount: 1000,
          description: "deposito teste"
        })
      }).rejects.toBeInstanceOf(CreateStatementError)
    })

    it("Should not be able to withdraw with insuficients funds", () => {
      expect(async () => {
        const user = {
          name: "Teste",
          email: "teste@gmail.com",
          password: "12345"
        }

        const userCreated = await createUserUseCase.execute(user);

        const { id } = userCreated;

        await createStatementUseCase.execute({
          user_id: String(id),
          type: OperationType.DEPOSIT,
          amount: 1000,
          description: "deposito teste"
        })

        await createStatementUseCase.execute({
          user_id: String(id),
          type: OperationType.WITHDRAW,
          amount: 1500,
          description: "saque de teste"
        })

      }).rejects.toBeInstanceOf(CreateStatementError)
    })
})
