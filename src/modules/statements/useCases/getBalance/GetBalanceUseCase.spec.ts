import { GetBalanceError } from './GetBalanceError';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';

import { GetBalanceUseCase } from './GetBalanceUseCase';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { Statement } from 'typescript';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase;

interface IResponse {
  statement: Statement[];
  balance: number;
}

describe("Get balance", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to get balance from a specific user", async () => {
    const user = {
      name: "Teste",
      email: "teste@gmail.com",
      password: "12345"
    }

    const userCreated = await createUserUseCase.execute(user);

    const { id } = userCreated;

    const ob: IResponse = {
      statement: [],
      balance: 0
    }

    const getBalance = await getBalanceUseCase.execute({user_id: String(id)})

    expect(getBalance).toMatchObject(ob)
  })

  it("Should not be able to get a balance form a non-existent user", () => {
    expect(async () => {
      const user = {
        name: "Teste",
        email: "teste@gmail.com",
        password: "12345"
      }

      await createUserUseCase.execute(user);

      await getBalanceUseCase.execute({user_id: 'dsadsadas-3213211-gfgfgf-5454'})

    }).rejects.toBeInstanceOf(GetBalanceError)
  })


})
