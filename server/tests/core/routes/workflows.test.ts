import { describe, expect, vi, beforeEach, test } from "vitest";
import type { Router, Request, Response, NextFunction } from "express";
import type { TokenProvider } from "../../../src/shared/auth/token-provider";
import { Controller } from "../../../src/presentation/protocols/controller";
import { WorkflowsRoutes } from "../../../src/core/routes/workflows";

vi.mock(
  "../../../src/modules/workflow/presentation/adapters/express-route",
  () => ({
    adaptRoute: vi.fn(
      (ctrl: Controller) =>
        (_req: Request, _res: Response, next: NextFunction) =>
          next()
    ),
  })
);

vi.mock("../../../src/modules/workflow/presentation/middlewares/auth", () => ({
  auth: vi.fn(
    (tp: TokenProvider) =>
      (_req: Request, _res: Response, next: NextFunction) =>
        next()
  ),
}));

describe("WorkflowsRoutes", () => {
  let router: Router;
  let controllers: Record<string, Controller>;
  let tokenProvider: TokenProvider;
  let routes: WorkflowsRoutes;

  beforeEach(() => {
    router = { post: vi.fn(), get: vi.fn(), delete: vi.fn() } as any;
    controllers = {
      create: {} as Controller,
      get: {} as Controller,
      list: {} as Controller,
      execute: {} as Controller,
      delete: {} as Controller,
    };
    tokenProvider = {} as TokenProvider;

    routes = new WorkflowsRoutes(
      controllers.create,
      controllers.list,
      controllers.execute,
      controllers.delete,
      controllers.get,
      tokenProvider
    );

    routes.register(router);
  });

  const routeAssertions = [
    { method: "post", path: "/workflows", controller: "create" },
    { method: "get", path: "/workflows/:workflowId", controller: "get" },
    { method: "get", path: "/workflows", controller: "list" },
    {
      method: "post",
      path: "/workflows/:workflowId/executions",
      controller: "execute",
    },
    { method: "delete", path: "/workflows/:workflowId", controller: "delete" },
  ];

  routeAssertions.forEach(({ method, path, controller }) => {
    test(`registers ${method.toUpperCase()} ${path}`, () => {
      expect((router as any)[method]).toHaveBeenCalledWith(
        path,
        expect.any(Function),
        expect.any(Function)
      );
    });
  });
});
