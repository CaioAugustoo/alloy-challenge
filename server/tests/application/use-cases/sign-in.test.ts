import { describe, expect, vi, beforeEach, test } from "vitest";
import { SignInUseCase } from "../../../src/application/use-cases/sign-in";
import { InvalidCredentialsError } from "../../../src/domain/errors/invalid-credentials";
import { oneDayInSeconds } from "../../../src/shared/timing/constants";
import type { UsersRepository } from "../../../src/domain/repositories/users";
import type { Hasher } from "../../../src/shared/hashing/hashing";
import type { TokenProvider } from "../../../src/shared/auth/token-provider";

describe("SignInUseCase", () => {
  let usersRepository: UsersRepository;
  let hasher: Hasher;
  let tokenProvider: TokenProvider;
  let useCase: SignInUseCase;

  const userParams = {
    email: "john@example.com",
    password: "123456",
  };

  const fakeUser = {
    id: "user-id-1",
    email: userParams.email,
    validatePassword: vi.fn(),
  };

  beforeEach(() => {
    usersRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
    };

    hasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    tokenProvider = {
      sign: vi.fn(),
      verify: vi.fn(),
    };

    useCase = new SignInUseCase(usersRepository, hasher, tokenProvider);
  });

  test("should throw InvalidCredentialsError if user is not found", async () => {
    (usersRepository.findByEmail as any).mockResolvedValue(undefined);

    await expect(useCase.execute(userParams)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  test("should throw InvalidCredentialsError if password is invalid", async () => {
    (usersRepository.findByEmail as any).mockResolvedValue(fakeUser);
    fakeUser.validatePassword.mockReturnValue(false);

    await expect(useCase.execute(userParams)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  test("should return token if credentials are valid", async () => {
    (usersRepository.findByEmail as any).mockResolvedValue(fakeUser);
    fakeUser.validatePassword.mockReturnValue(true);
    (tokenProvider.sign as any).mockReturnValue("valid-token");

    const response = await useCase.execute(userParams);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userParams.email);
    expect(fakeUser.validatePassword).toHaveBeenCalledWith(
      userParams.password,
      hasher
    );
    expect(tokenProvider.sign).toHaveBeenCalledWith(
      { sub: fakeUser.id, email: fakeUser.email },
      oneDayInSeconds
    );
    expect(response).toEqual({ accessToken: "valid-token" });
  });
});
