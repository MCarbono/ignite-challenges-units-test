import { GetStatementOperationError } from "./GetStatementOperationError";

import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../../useCases/createStatement/CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Get Statement Operations', () => {
    beforeEach(() => {
      inMemoryStatementsRepository = new InMemoryStatementsRepository();
      inMemoryUsersRepository = new InMemoryUsersRepository();

      getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
      createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    })

    it("Should be able to get information from a specific statement", async () => {
      const user = {
        name: "Teste",
        email: "teste@gmail.com",
        password: "12345"
      }

      const userCreated = await createUserUseCase.execute(user);

      const { id: user_id } = userCreated;

      const statement = await createStatementUseCase.execute({
        user_id: String(user_id),
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "freela"
      })

      const { id: statement_id } = statement;

      const statementOperations = await getStatementOperationUseCase.execute({
        user_id: String(user_id),
        statement_id: String(statement_id)
      })

      expect(statementOperations).toBe(statementOperations)
    })

    it("Should not be able to find a statement with invalid user", () => {
      expect(async () => {
        const user = {
          name: "Teste",
          email: "teste@gmail.com",
          password: "12345"
        }

        const userCreated = await createUserUseCase.execute(user);

        const { id: user_id } = userCreated;

        const statement = await createStatementUseCase.execute({
          user_id: String(user_id),
          type: OperationType.DEPOSIT,
          amount: 1000,
          description: "freela"
        })

        const { id: statement_id } = statement;

         await getStatementOperationUseCase.execute({
          user_id: 'dsdasd-323321-fdfdfdfd-5466556',
          statement_id: String(statement_id)
        })

      }).rejects.toBeInstanceOf(GetStatementOperationError)
    })

    it("Should not be able to get a statement operation that does not exists", () => {
      expect(async () => {
        const user = {
          name: "Teste",
          email: "teste@gmail.com",
          password: "12345"
        }

        const userCreated = await createUserUseCase.execute(user);

        const { id: user_id } = userCreated;

         await getStatementOperationUseCase.execute({
          user_id: String(user_id),
          statement_id: "dsadsdsdsa-e23213212-dfdfdfd-54545544"
        })

      }).rejects.toBeInstanceOf(GetStatementOperationError)
    })
})
