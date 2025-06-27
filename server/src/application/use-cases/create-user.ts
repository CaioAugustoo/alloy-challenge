import { EmailInUseError } from "../../domain/errors/email-in-use";
import { User } from "../../domain/entities/user";
import type { TokenProvider } from "../../shared/auth/token-provider";
import type { Hasher } from "../../shared/hashing/hashing";
import type { UsersRepository } from "../../domain/repositories/users";
import type { CreateUserUseCase as CreateUserUseCaseInterface } from "../../domain/use-cases/create-user";

const oneDayInSeconds = 1 * 24 * 3600;

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: Hasher,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(
    params: CreateUserUseCaseInterface.Params
  ): Promise<CreateUserUseCaseInterface.Response> {
    const { name, email, password } = params;

    const foundUser = await this.usersRepository.findByEmail(email);
    if (!!foundUser) {
      throw new EmailInUseError();
    }

    const user = await User.createNew(name, email, password, this.hasher);
    await this.usersRepository.create(user);

    const tokenPayload = {
      sub: user.id,
      email: email,
    };

    const accessToken = this.tokenProvider.sign(tokenPayload, oneDayInSeconds);

    return {
      accessToken,
    };
  }
}
