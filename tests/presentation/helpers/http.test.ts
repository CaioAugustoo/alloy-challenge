import { describe, it, expect, test } from "vitest";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import {
  badRequest,
  internalServerError,
  noContent,
  ok,
} from "../../../src/presentation/helpers/http";
import { InternalServerError } from "../../../src/presentation/errors/internal-server-error";

describe("HTTP Helpers", () => {
  describe("badRequest", () => {
    test("should return statusCode 400 and the error in body", () => {
      const error = new Error("Bad request");
      const response: HttpResponse = badRequest(error);

      expect(response.statusCode).toBe(400);
      expect(response.body).toBe(error);
    });
  });

  describe("internalServerError", () => {
    test("should return statusCode 500 and wrap error in InternalServerError", () => {
      const error = new Error("Something went wrong");
      error.stack = "stack-trace";

      const response: HttpResponse = internalServerError(error);

      expect(response.statusCode).toBe(500);
      const body = response.body;
      expect(body).toBeInstanceOf(InternalServerError);
      if (body instanceof InternalServerError) {
        expect(body.message).toBe("Something went wrong");
        expect(body.stack).toBe("stack-trace");
      }
    });

    test("should use empty stack if original error.stack is undefined", () => {
      const error = new Error("No stack");
      delete error.stack;

      const response: HttpResponse = internalServerError(error);

      expect(response.statusCode).toBe(500);
      const body = response.body;
      expect(body).toBeInstanceOf(InternalServerError);
      if (body instanceof InternalServerError) {
        expect(body.message).toBe("No stack");
        expect(body.stack).toBe("");
      }
    });
  });

  describe("ok", () => {
    test("should return statusCode 200 and the provided data in body", () => {
      const data = { success: true };
      const response: HttpResponse = ok(data);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(data);
    });

    test("should handle primitive data", () => {
      const data = "string";
      const response: HttpResponse = ok(data);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe("string");
    });
  });

  describe("noContent", () => {
    test("should return statusCode 204 and undefined body", () => {
      const response: HttpResponse = noContent();

      expect(response.statusCode).toBe(204);
      expect(response.body).toBeUndefined();
    });
  });
});
