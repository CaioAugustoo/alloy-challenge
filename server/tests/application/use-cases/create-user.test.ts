import { describe, expect, vi, beforeEach, test } from "vitest";
import { UsersRepository } from "../../../src/domain/repositories/users";
import { Hasher } from "../../../src/shared/hashing/hashing";
import { TokenProvider } from "../../../src/shared/auth/token-provider";
import { EmailInUseError } from "../../../src/domain/errors/email-in-use";
import { CreateUserUseCase } from "../../../src/application/use-cases/create-user";
import { User } from "../../../src/domain/entities/user";

vi.mock("../../domain/entities/user");

describe("CreateUserUseCase", () => {
  let usersRepository: UsersRepository;
  let hasher: Hasher;
  let tokenProvider: TokenProvider;
  let useCase: CreateUserUseCase;

  const userParams = {
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
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

    useCase = new CreateUserUseCase(usersRepository, hasher, tokenProvider);
  });

  test("should throw EmailInUseError if user already exists", async () => {
    (usersRepository.findByEmail as any).mockResolvedValue({ id: "1" });

    await expect(useCase.execute(userParams)).rejects.toThrow(EmailInUseError);
  });

  test("should create user and return token if user does not exist", async () => {
    const fakeUser = await User.createNew(
      userParams.name,
      userParams.email,
      userParams.password,
      hasher
    );
    (usersRepository.findByEmail as any).mockResolvedValue(undefined);
    vi.spyOn(User, "createNew").mockResolvedValue(fakeUser);
    (tokenProvider.sign as any).mockReturnValue("valid-token");

    const response = await useCase.execute(userParams);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userParams.email);
    expect(User.createNew).toHaveBeenCalledWith(
      userParams.name,
      userParams.email,
      userParams.password,
      hasher
    );
    expect(usersRepository.create).toHaveBeenCalledWith(fakeUser);
    expect(tokenProvider.sign).toHaveBeenCalled();
    expect(response).toEqual({ accessToken: "valid-token" });
  });
});
