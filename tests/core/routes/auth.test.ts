import { describe, expect, vi, test } from "vitest";
import { Router } from "express";
import { AuthRoutes } from "../../../src/core/routes/auth";

describe("AuthRoutes", () => {
  test("should register POST /signup route with adapted controller", () => {
    const router = {
      post: vi.fn(),
    } as unknown as Router;

    const mockController = {} as any;
    const authRoutes = new AuthRoutes(mockController);

    authRoutes.register(router);

    expect(router.post).toHaveBeenCalledTimes(1);
    expect(router.post).toHaveBeenCalledWith("/signup", expect.any(Function));
  });
});
