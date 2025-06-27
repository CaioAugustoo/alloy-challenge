import { describe, expect, vi, beforeEach, test } from "vitest";
import { SignUpUseCase } from "../../../src/domain/use-cases/sign-up";
import { SignUpController } from "../../../src/presentation/controllers/sign-up";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import {
  created,
  internalServerError,
  ok,
} from "../../../src/presentation/helpers/http";
import type { Mock } from "vitest";

const makeUseCase = () => {
  const useCase: Partial<SignUpUseCase> = { execute: vi.fn() };
  return useCase as SignUpUseCase;
};

describe("SignUpController", () => {
  let useCase: SignUpUseCase;
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

  test("should call SignUpUseCase and return ok on success", async () => {
    const user = { id: "user-1", name: request.name, email: request.email };
    (useCase.execute as Mock).mockResolvedValue(user);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password,
    });
    expect(response).toEqual(created(user));
    expect(response.statusCode).toBe(201);
    expect(response.body).toBe(user);
  });

  test("should return internalServerError if SignUpUseCase throws", async () => {
    const error = new Error("use case failed");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalled();
    expect(response).toEqual(internalServerError(error));
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
