import { CreateUserError } from './CreateUserError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new User", async () => {
    const user = {
      name: "Marcelo",
      password: "1234",
      email: "marcelo@gmail.com"
    }
    await createUserUseCase.execute({
      name: user.name,
      password: user.password,
      email: user.email
    })

    expect(201)
  })

  it("Should not be able to create a already existent user", async () => {
    expect(async () => {
      const user = {
        name: "teste",
        password: "12345",
        email: "teste@gmail.com"
      }

      await createUserUseCase.execute({
        name: user.name,
        password: user.password,
        email: user.email
      })

      await createUserUseCase.execute({
        name: user.name,
        password: user.password,
        email: user.email
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
