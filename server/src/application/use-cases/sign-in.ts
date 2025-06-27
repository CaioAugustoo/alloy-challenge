import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials";
import { oneDayInSeconds } from "../../shared/timing/constants";
import type { SignInUseCase as SignInUseCaseInterface } from "../../domain/use-cases/sign-in";
import type { UsersRepository } from "../../domain/repositories/users";
import type { TokenProvider } from "../../shared/auth/token-provider";
import type { Hasher } from "../../shared/hashing/hashing";

export class SignInUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: Hasher,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(
    params: SignInUseCaseInterface.Params
  ): Promise<SignInUseCaseInterface.Response> {
    const { email, password } = params;

    const foundUser = await this.usersRepository.findByEmail(email);
    if (!foundUser) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await foundUser.validatePassword(
      password,
      this.hasher
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const tokenPayload = {
      sub: foundUser.id,
      email: foundUser.email,
    };

    const accessToken = this.tokenProvider.sign(tokenPayload, oneDayInSeconds);

    return {
      accessToken,
    };
  }
}
