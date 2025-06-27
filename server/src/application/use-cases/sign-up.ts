import { EmailInUseError } from "../../domain/errors/email-in-use";
import { User } from "../../domain/entities/user";
import { oneDayInSeconds } from "../../shared/timing/constants";
import type { TokenProvider } from "../../shared/auth/token-provider";
import type { Hasher } from "../../shared/hashing/hashing";
import type { UsersRepository } from "../../domain/repositories/users";
import type { SignUpUseCase as SignUpUseCaseInterface } from "../../domain/use-cases/sign-up";

export class SignUpUseCase implements SignUpUseCaseInterface {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: Hasher,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(
    params: SignUpUseCaseInterface.Params
  ): Promise<SignUpUseCaseInterface.Response> {
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
