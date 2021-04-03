import { ShowUserProfileError } from './ShowUserProfileError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../useCases/createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("User profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("Should be able to show user's profile", async () => {
    const user = {
      name: "teste",
      password: "1234",
      email: "teste@gmail.com"
    }

    const createdUser = await createUserUseCase.execute(user)

    const result = await showUserProfileUseCase.execute(String(createdUser.id))

    expect(createdUser).toEqual(result)
  })

  it("Should not be able to list user' profile with incorrect id", () => {
    expect(async () => {
      const user = {
        name: "teste",
        password: "1234",
        email: "teste@gmail.com"
      }

      await createUserUseCase.execute(user)

      await showUserProfileUseCase.execute('dsdsdsadsadsadsadasd')

    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})

