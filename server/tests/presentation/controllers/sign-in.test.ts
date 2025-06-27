import { describe, expect, vi, beforeEach, test } from "vitest";
import { SignUpUseCase } from "../../../src/domain/use-cases/sign-up";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import {
  internalServerError,
  ok,
} from "../../../src/presentation/helpers/http";
import { SignInController } from "../../../src/presentation/controllers/sign-in";

import type { Mock } from "vitest";

const makeUseCase = () => {
  const useCase: Partial<SignUpUseCase> = { execute: vi.fn() };
  return useCase as SignUpUseCase;
};

describe("SignInController", () => {
  let useCase: SignUpUseCase;
  let controller: SignInController;
  const request: SignInController.Request = {
    email: "john@example.com",
    password: "pass123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = makeUseCase();
    controller = new SignInController(useCase);
  });

  test("should call SignInUseCase and return ok on success", async () => {
    const fakeResponse = {
      accessToken: "fake-token",
    };
    (useCase.execute as Mock).mockResolvedValue(fakeResponse);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
    expect(response).toEqual(ok(fakeResponse));
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(fakeResponse);
  });

  test("should return internalServerError if SignInUseCase throws", async () => {
    const error = new Error("use case failed");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalled();
    expect(response).toEqual(internalServerError(error));
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
