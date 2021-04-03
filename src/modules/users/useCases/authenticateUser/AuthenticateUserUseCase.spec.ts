import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../../useCases/createUser/CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate an user", async () => {
    const user = {
      name: "Marcelo",
      password: "1234",
      email: "marcelo@gmail.com"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
        email: "marcelo@gmail.com",
        password: "1234"
    })

    expect(result).toHaveProperty("token");
  })

  it("Should not be able to authenticate a user with a wrong email or password(password)", () => {
    expect(async () => {
      const user = {
        name: "Carbono",
        email: "carbono@gmail.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: "carbono@gmail.com",
        password: "12345"
      })

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate a user with a wrong email or password(email)", () => {
    expect(async () => {
      const user = {
        name: "Filho",
        email: "filho@gmail.com",
        password: "12345"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: "filho1@gmail.com",
        password: "12345"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
