import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { CreateUserUseCase } from "../../../src/domain/use-cases/create-user";
import { SignUpController } from "../../../src/presentation/controllers/signup";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import {
  badRequest,
  internalServerError,
  ok,
} from "../../../src/presentation/helpers/http";

const makeUseCase = () => {
  const useCase: Partial<CreateUserUseCase> = { execute: vi.fn() };
  return useCase as CreateUserUseCase;
};

describe("SignUpController", () => {
  let useCase: CreateUserUseCase;
  let controller: SignUpController;
  const request: SignUpController.Request = {
    name: "John",
    email: "john@example.com",
    password: "pass123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = makeUseCase();
    controller = new SignUpController(useCase);
  });

  it("should call createUserUseCase and return ok on success", async () => {
    const user = { id: "user-1", name: request.name, email: request.email };
    (useCase.execute as Mock).mockResolvedValue(user);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password,
    });
    expect(response).toEqual(ok(user));
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(user);
  });

  it("should return internalServerError if createUserUseCase throws", async () => {
    const error = new Error("use case failed");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalled();
    expect(response).toEqual(internalServerError(error));
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
