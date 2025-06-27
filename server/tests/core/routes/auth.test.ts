import { describe, expect, vi, test } from "vitest";
import { Router } from "express";
import { AuthRoutes } from "../../../src/core/routes/auth";

describe("AuthRoutes", () => {
  test("should register POST /signup route with adapted controller", () => {
    const router = {
      post: vi.fn(),
    } as unknown as Router;

    const mockController = {} as any;
    const authRoutes = new AuthRoutes(mockController, mockController);

    authRoutes.register(router);

    expect(router.post).toHaveBeenCalledWith("/signup", expect.any(Function));
  });

  test("should register POST /signin route with adapted controller", () => {
    const router = {
      post: vi.fn(),
    } as unknown as Router;

    const mockController = {} as any;
    const authRoutes = new AuthRoutes(mockController, mockController);

    authRoutes.register(router);

    expect(router.post).toHaveBeenCalledWith("/signin", expect.any(Function));
  });
});
